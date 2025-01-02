// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useCallback } from 'react';
import { QBusinessClient, ListMessagesCommand } from "@aws-sdk/client-qbusiness";
import { useQbizCredentials } from './useQBizCredentials';
import { insertSupTags } from '../utils/citationHelper';
import { useGlobalConfig } from '../providers/GlobalConfigContext';

const useMessages = ({ issuer, appId, roleArn, region, email }) => {
    const [isLoadingMessages, setIsLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [nextToken, setNextToken] = useState(null);
    const { data: credentials, isLoading: loadingClient } = useQbizCredentials(issuer, email, region, roleArn);
    const { showInlineCitation } = useGlobalConfig();

    const resetMessages = () => {
      setIsLoading(false);
      setMessagesError(null);
      setMessageList([]);
      setNextToken(null);
    }

    const transformMessages = (messages, conversationId) => {
      const transformed = [];
    
      messages.forEach((message) => {
        const { messageId, type, sourceAttribution = [], time, body } = message;
        const source = sourceAttribution.map((attribution) => ({
          title: attribution.title,
          citationNumber: attribution.citationNumber,
          url: attribution.url,
          snippet: attribution.snippet,
          citationMarkers: attribution.textMessageSegments.map(it => ({
            beginOffset: it.beginOffset,
            endOffset: it.endOffset,
            snippet: it?.snippetExcerpt?.text || ''
          }))
        }));
        
        let text = body;
        if (showInlineCitation){
          text = insertSupTags(text, source);
        }
        
        transformed.push({
          sender: type,
          text,
          conversationId,
          messageId,
          source,
          time,
        });        
      });
    
      transformed.sort((a, b) => a.time - b.time);
      return transformed;
    };
    
      
    const getListMessages = useCallback(async (conversationId, token = null) => {
        const payload = {
            applicationId: appId,
            conversationId,
            nextToken: token,
            maxResults: 100,
            headers: {
              'Content-Type': 'application/json',
            },
        };
        
        try {
            setIsLoading(true);
            const qclient = new QBusinessClient({ region, credentials: credentials });    
            const command = new ListMessagesCommand(payload);
            const response = await qclient.send(command);
            
            const transformedMessages = transformMessages(response.messages, conversationId);            
            setMessageList([...transformedMessages]);
            setNextToken(response.nextToken);
            setIsLoading(false);          
        } catch (err) {
            setMessagesError(`Error fetching messages: ${err.message}`);
            setIsLoading(false);
            throw err;
        }        
    }, [appId, credentials]);

    const loadMoreMessages = useCallback(async (conversationId, instructions) => {
        if (nextToken) {          
            try {
                await getListMessages(conversationId, nextToken);                
            } catch (err) {
                setMessagesError(`Error fetching messages: ${err.message}`);
                console.error("Failed to load more messages:", err);
            }
        }
    }, [nextToken, getListMessages]);
    
    return { isLoadingMessages, messageList, messagesError, resetMessages, getListMessages, loadMoreMessages, hasMoreMessages: !!nextToken };
};

export default useMessages;