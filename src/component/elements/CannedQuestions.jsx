// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { useGlobalConfig } from '../providers/GlobalConfigContext';

const CannedQuestions = ({ questions, onClick }) => {
  const displayQuestions = questions.slice(0, 6);
  const { theme  } = useGlobalConfig();

  const styling = {
    bgColor: theme?.userMsgBgColor || "",
    textColor: theme?.msgTextColor || ""
  }

  return (
    <>
        <div className='mt-4 text-sm text-gray-400 text-center'>Get Started</div>
        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 p-4">
        {displayQuestions.map((question, index) => (
            <button
                key={index}
                aria-label={`Canned Question number ${index+1}`}
                name={`canned-question-${index+1}`}
                onClick={() => onClick(question)}
                className="bg-white text-gray-500 py-2 px-4 rounded-lg shadow hover:bg-gray-100 transition-colors
                        duration-200 text-left text-sm overflow-hidden overflow-ellipsis whitespace-nowrap"
                style={{backgroundColor: styling["bgColor"], color: styling["textColor"]}}
            >
            {question}
            </button>
        ))}
        </div>
    </>
  );
};

export default CannedQuestions;