// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState } from 'react'
import { QBusinessClient, PutFeedbackCommand } from "@aws-sdk/client-qbusiness";
import { useQbizCredentials } from './useQBizCredentials';

const useChatFeedback = ({ issuer, appId, roleArn, region, email }) => {
    const [error, setError] = useState(null);
    const { data: credentials, isLoading: loadingClient } = useQbizCredentials(issuer, email, region, roleArn);

    const putFeedback = async(conversationId, messageId, usefulness="USEFUL", reason="HELPFUL", comment="") => {
        const feedbackPayload = {
            applicationId: appId,
            userId: email,
            conversationId,
            messageId,
            messageCopiedAt: new Date(),
            messageUsefulness: { 
                usefulness, 
                reason,
                comment,
                submittedAt: new Date()
            }
        }
        try {
            const qclient = new QBusinessClient({ region, credentials: credentials });    
            const command = new PutFeedbackCommand(feedbackPayload);
            await qclient.send(command);
            // await qbizClient.send(command);
            return ({message: "Thanks for your feedback!"})
        } catch (error) {
            setError(`Error sending message: ${error.message}`);            
        }        

    }
    
    return ({putFeedback, error})
}

export default useChatFeedback