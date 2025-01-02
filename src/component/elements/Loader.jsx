// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { LoaderCircle } from 'lucide-react';

const Loader = ({ size = 24, color = 'currentColor', className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoaderCircle 
        size={size} 
        color={color} 
        className="animate-spin"
      />
    </div>
  );
};

export default Loader;