// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useEffect, useCallback } from 'react';
import { QBusinessClient, ListConversationsCommand } from "@aws-sdk/client-qbusiness";
import { useQbizCredentials } from './useQBizCredentials';

const useListConversations = ({ issuer, appId, roleArn, region, email }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [nextToken, setNextToken] = useState(null);
    const { data: credentials, isLoading: loadingClient, isSuccess, error: credError } = useQbizCredentials(issuer, email, region, roleArn);

    const getListConversations = useCallback(async (token = null) => {
        const payload = {
            applicationId: appId,
            userId: null,
            nextToken: token,
            maxResults: 100
        };
        try {
            setIsLoading(true);
            const qclient = new QBusinessClient({ region, credentials: credentials });    
            const command = new ListConversationsCommand(payload);
            const response = await qclient.send(command);            
            setIsLoading(false);
            return response;
        } catch (err) {
            setError(`Error fetching conversations: ${err.message}`);
            setIsLoading(false);
            throw err;
        }        
    }, [appId, credentials]);

    const refreshListConversations = useCallback(async (token = null) => {
        if(loadingClient || !credentials) return;
        const payload = {
            applicationId: appId,
            userId: null,
            nextToken: token,
            maxResults: 100
        };        
        try {
            setIsLoading(true);
            const qclient = new QBusinessClient({ region, credentials: credentials });
            const command = new ListConversationsCommand(payload);
            const response = await qclient.send(command);            
            setConversations(response.conversations);
            setNextToken(response.nextToken);
            setIsLoading(false);            
        } catch (err) {
            setError(`Error fetching conversations: ${err.message}`);
            setIsLoading(false);
            throw err;
        }        
    }, [appId, credentials]);

    const loadMoreConversations = useCallback(async () => {
        if (nextToken) {
            try {
                const response = await getListConversations(nextToken);
                setConversations(prevConversations => [...prevConversations, ...response.conversations]);
                setNextToken(response.nextToken);
            } catch (err) {
                setError(`Error fetching conversations: ${err.message}`);
                console.error("Failed to load more conversations:", err);
            }
        }
    }, [nextToken, getListConversations]);

    useEffect(() => {
        const initializeConversations = async () => {
            try {
                if(issuer && isSuccess){
                    const response = await getListConversations();
                    setConversations(response.conversations);
                    setNextToken(response.nextToken);
                }else{
                    setIsLoading(true)
                }
                
            } catch (err) {
                setError(`Error fetching conversations: ${err.message}`);
                console.error("Failed to initialize conversations:", err);
            }
        };

        initializeConversations();
    }, [getListConversations, isSuccess]);
    
    return { isLoading, conversations, error, refreshListConversations, loadMoreConversations, hasMore: !!nextToken };
};

export default useListConversations;