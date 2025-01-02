// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { EventStreamCodec } from "@smithy/eventstream-codec";
import { fromUtf8, toUtf8 } from "@smithy/util-utf8";

const eventStreamCodec = new EventStreamCodec(toUtf8, fromUtf8);
const isNullOrUndefined = (value) => value === null || value === undefined;

const decodeBodyToString = (body) => {
  const decoder = new TextDecoder(); // Default to 'utf-8' encoding
  return decoder.decode(body);
};

export const decodeEventStream = async (dataBuffer) => {
  if (!dataBuffer || typeof dataBuffer.arrayBuffer !== 'function') {
    return { data: 'Unknown error occurred', exceptionType: 'UnknownException' };
  }
  const buffer = await dataBuffer.arrayBuffer()
  const decodedMessage = eventStreamCodec.decode(new Uint8Array(buffer));

  const { 
    ":message-type": messageType, 
    ":event-type": eventType,
    ":exception-type": exceptionType
  } = decodedMessage.headers;

  const decodedBody = decodeBodyToString(decodedMessage.body);

  const streamEvent = JSON.parse(decodedBody);

  if(messageType.value === "event"){
    if (eventType.value == "metadataEvent") {
      // The metadataEvent contains the final complete message, so no need to return individual text chunks.
      return {eventType: eventType.value, data: streamEvent};
    }
  
    if (eventType.value === "textEvent") {
      // the only useful value in streamEvent is systemMessage
      // other values are conversationId, systemMessageId, userMessageId
      // we already know conversationId and userMessageId. metadataEvent
      // will give us systemMessageId. So we only need systemMessage.
      return {eventType: eventType.value, data: streamEvent["systemMessage"]};
    }
  }
  
  // catch errors
  if(messageType.value === "exception" && !isNullOrUndefined(exceptionType.value)){
    /**
     * The data will be the error description and may be verbose.
     * The important part is exceptionType which will be things like
     * BadRequestException, InternalFailureException, InternalServerException,
     * ThrottlingException, ResourceNotFoundException, ValidationException, LicenseNotFoundException
     * AccessDeniedException, ExpiredTokenException
     * https://docs.aws.amazon.com/amazonq/latest/api-reference/CommonErrors.html 
     */
    return {eventType: messageType.value, data: decodedBody, exceptionType: exceptionType?.value.toString()}
  }
};
