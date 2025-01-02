// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState } from 'react'
import { QBusinessClient, DeleteConversationCommand } from "@aws-sdk/client-qbusiness";
import { useQbizCredentials } from './useQBizCredentials';

const useDeleteConversation = ({ issuer, appId, roleArn, region, email }) => {
    const [delError, setDelError] = useState(null);
    const [delLoading, setDelLoading] = useState(false);
    const { data: credentials, isLoading: loadingClient } = useQbizCredentials(issuer, email, region, roleArn);

    const delConversation = async(conversationId) => {
        const delPayload = {
            applicationId: appId,
            conversationId
        }
        try {
            setDelLoading(true);
            const qclient = new QBusinessClient({ region, credentials: credentials });   
            const command = new DeleteConversationCommand(delPayload);
            await qclient.send(command);
            // await qbizClient.send(command);
            setDelLoading(false);
            return ({message: "Thanks for your feedback!"})            
        } catch (error) {
            setDelLoading(false);
            setDelError(`Error sending message: ${error.message}`);            
        }        

    }
    
    return ({delConversation, delError, delLoading})
}

export default useDeleteConversation;