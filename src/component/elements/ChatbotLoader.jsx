// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

const ChatbotLoader = ({ color = '#6366F1', speed = 1 }) => (
  <svg
    className="w-12 h-12"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* First Orbiting Electron */}
    <circle cx="80" cy="50" r="6" fill={color}>
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur={`${2 / speed}s`} // Animation speed controlled by prop
        repeatCount="indefinite"
      />
      <animate
        attributeName="r"
        values="6;8;6"
        dur={`${1 / speed}s`}
        repeatCount="indefinite"
      />
    </circle>

    {/* Second Orbiting Electron */}
    <circle cx="50" cy="80" r="5" fill={color} opacity="0.8">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="-360 50 50"
        dur={`${2.4 / speed}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="r"
        values="5;7;5"
        dur={`${1.2 / speed}s`}
        repeatCount="indefinite"
      />
    </circle>

    {/* Third Orbiting Electron */}
    <circle cx="20" cy="50" r="4" fill={color} opacity="0.6">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur={`${2.8 / speed}s`}
        begin="0.2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="r"
        values="4;6;4"
        dur={`${1.3 / speed}s`}
        repeatCount="indefinite"
      />
    </circle>

    {/* Fourth Orbiting Electron */}
    <circle cx="50" cy="20" r="3.5" fill={color} opacity="0.5">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="-360 50 50"
        dur={`${3.2 / speed}s`}
        begin="0.3s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="r"
        values="3.5;5;3.5"
        dur={`${1.4 / speed}s`}
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default ChatbotLoader;
