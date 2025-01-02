// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { EventStreamCodec } from "@smithy/eventstream-codec";
import { fromUtf8, toUtf8 } from "@smithy/util-utf8";

const eventStreamCodec = new EventStreamCodec(toUtf8, fromUtf8);

const createEventMessage = (eventType,eventBody)=> {
    return {
      headers: {
        ":content-type": {
          type: "string",
          value: "application/x-amz-json-1.0",
        },
        ":event-type": {
          type: "string",
          value: eventType,
        },
        ":message-type": {
          type: "string",
          value: "event",
        },
      },
      body: new TextEncoder().encode(JSON.stringify(eventBody)),
    };
};

const hexToUint8Array = (hexString) => {
  /**
   * Pure javascript -- no pollyfill needed
   */
  const length = hexString.length / 2;
  const array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return array;
};


/**
 * Encodes an event stream message with fixed and dynamic headers.
 */
export const encodeEventStream = async (eventType, body = null, sigV4, priorSignature) => {
    const eventPayload = createEventMessage(eventType, body);
    const framedEventPayload = eventStreamCodec.encode(eventPayload);
    const now = new Date();
    const messageDateHeader = {
      ":date": { 
        type: "timestamp", 
        value: now 
      },
    };
    const eventMessageSignature = await sigV4.sign(
      {
        payload: framedEventPayload,
        headers: eventStreamCodec.formatHeaders(messageDateHeader),
      },
      {
        priorSignature,
        signingDate: now,
      }
    );
    const eventMessage = {
      body: framedEventPayload,
      headers: {
        ...messageDateHeader,
        ":chunk-signature": {
          type: "binary",
          value: hexToUint8Array(eventMessageSignature),
        },
      },
    };
    const framedEventMessage = eventStreamCodec.encode(eventMessage);

    return {
      encodedEvent: framedEventMessage,
      signature: eventMessageSignature,
    };
};

