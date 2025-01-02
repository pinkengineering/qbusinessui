// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { createContext, useState, useContext } from 'react';

// Create the context
const GlobalConfigContext = createContext();

// Create a provider component
export const GlobalConfigProvider = ({ children }) => {
  const [issuer, setIssuer] = useState('');
  const [email, setEmail] = useState('');
  const [qBusinessAppId, setQBusinessAppId] = useState('');
  const [awsRegion, setAwsRegion] = useState('');
  const [iamRoleArn, setIamRoleArn] = useState('');
  const [theme, setTheme] = useState({});
  const [showInlineCitation, seShowInlineCitation] = useState(true);

  const updateConfig = (newConfig) => {
    const issuerUrl = newConfig.issuer || issuer;
    const cleanIssuer = issuerUrl.endsWith('/') ? issuerUrl.slice(0, -1) : issuerUrl;
    setIssuer(cleanIssuer);
    setEmail(newConfig.email || email);
    setQBusinessAppId(newConfig.qBusinessAppId || qBusinessAppId);
    setAwsRegion(newConfig.awsRegion || awsRegion);
    setIamRoleArn(newConfig.iamRoleArn || iamRoleArn);
    setTheme(newConfig.theme || {});
    seShowInlineCitation(newConfig.showInlineCitation || true)
  };

  return (
    <GlobalConfigContext.Provider 
      value={{
        showInlineCitation,
        issuer,
        email,
        qBusinessAppId,
        awsRegion,
        iamRoleArn,
        theme,
        updateConfig
      }}
    >
      {children}
    </GlobalConfigContext.Provider>
  );
};

// Custom hook for using the context
export const useGlobalConfig = () => {
  const context = useContext(GlobalConfigContext);
  if (!context) {
    throw new Error('useGlobalConfig must be used within a GlobalConfigProvider');
  }
  return context;
};
