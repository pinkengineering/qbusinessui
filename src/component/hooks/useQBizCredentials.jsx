// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useQuery } from '@tanstack/react-query';
import { fromWebToken } from "@aws-sdk/credential-providers";
import { v4 as uuidv4 } from 'uuid';

// Replace these with actual values
const TVM_CLIENT_ID = 'oidc-tvm-867344447185';
const TVM_CLIENT_SECRET = '7c50f35f3288f04bca7108f6';

const fetchIdToken = async (issuer, email) => {
  if (!issuer) {
    throw new Error("Issuer is required to fetch the ID token.");
  }
  if (!email) {
    throw new Error("Email is required to fetch the ID token.");
  }

  console.log("Issuer URL:", issuer);
  console.log("Email:", email);

  const authHeader = btoa(`${TVM_CLIENT_ID}:${TVM_CLIENT_SECRET}`);

  try {
    const response = await fetch(`${issuer.replace(/\/$/, "")}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch ID token:', response.status, errorText);
      throw new Error(`Failed to fetch ID token: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.id_token) {
      throw new Error("ID token not found in the response.");
    }

    console.log("Token fetched successfully:", data.id_token);
    return data.id_token;
  } catch (error) {
    console.error("Error in fetchIdToken:", error.message);
    throw error;
  }
};

const createCredentials = async (issuer, email, region, roleArn) => {
  console.log("createCredentials function called");
  if (!issuer || !email || !region || !roleArn) {
    throw new Error("All parameters (issuer, email, region, roleArn) are required.");
  }

  try {
    const idToken = await fetchIdToken(issuer, email);

    const provider = fromWebToken({
      roleArn,
      webIdentityToken: idToken,
      clientConfig: { region },
      roleSessionName: `session-${uuidv4()}-${Date.now()}`,
      durationSeconds: 900, // 15 minutes
    });

    const credentials = await provider();
    console.log("AWS Credentials fetched successfully:", credentials);
    return credentials;
  } catch (error) {
    console.error("Error in createCredentials:", error.message);
    throw error;
  }
};

export const useQbizCredentials = (issuer, email, region, roleArn) => {
  return useQuery({
    queryKey: ['qbizCredentials', issuer, email, region, roleArn],
    queryFn: () => createCredentials(issuer, email, region, roleArn),
    enabled: !!issuer && !!email && !!region && !!roleArn, // Avoid invalid calls
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    refetchIntervalInBackground: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error("Error in useQbizCredentials:", error.message);
    },
  });
};

console.log("fetchIdToken and useQbizCredentials functions initialized.");
