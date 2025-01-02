// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import { CircleCheck, Info, X, OctagonX } from 'lucide-react';

const ICONS = {
  success: <CircleCheck className="text-green-500 w-5 h-5" />,
  warning: <Info className="text-yellow-500 w-5 h-5" />,
  error: <OctagonX className="text-red-500 w-5 h-5" />,
};

const COLORS = {
  success: 'bg-green-50 text-green-700 border-green-300',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  error: 'bg-red-50 text-red-700 border-red-300',
};

const Alert = ({
  type = 'success', // 'success', 'warning', 'error'
  title,
  subTitle,
  floaty = false, // If true, float down from top
  onDismiss = null, // Optional dismiss handler
  autoDismiss = true, // Auto-dismiss for floaty alerts
  dismissTime = 3000, // Time in ms for auto-dismiss
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (floaty && autoDismiss) {
      const timer = setTimeout(() => setVisible(false), dismissTime);
      return () => clearTimeout(timer);
    }
  }, [floaty, autoDismiss, dismissTime]);

  if (!visible) return null;

  return (
    <div
      className={
        `rounded-lg p-2 mb-2 border flex items-start gap-3 shadow-md ${COLORS[type]} ${floaty ? 'fixed top-5 left-1/2 transform -translate-x-1/2 z-50' : ''}`
      }
    >
      <div>{ICONS[type]}</div>
      <div className="flex-1">
        {title && <h3 className="font-bold">{title}</h3>}
        {subTitle && <p className="text-sm">{subTitle}</p>}
      </div>
      {onDismiss && (
        <button
          onClick={() => {
            setVisible(false);
            onDismiss && onDismiss();
          }}
          className={`text-gray-500 hover:text-gray-800 transition ${COLORS[type]}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;