// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react';
import { X } from 'lucide-react';
import defaultLogo from '../../assets/fa-logo.png';
import feedbackOptions from '../utils/thumbsdownFeedback.json'
import { useGlobalConfig } from '../providers/GlobalConfigContext';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [includeConversation, setIncludeConversation] = useState(false);
  const { theme  } = useGlobalConfig();

  const feedbackStyle = {
    bgColor: theme?.bgColor || "", 
    textColor: theme?.msgTextColor || "",
    bottomColor: theme?.userMsgBgColor || ""  
  }

  if (!isOpen) return null;

  const handleSubmit = () => {
    const feedbackData = {
      feedbackType: selectedOption,
      additionalDetails,
      includeConversation
    };
    onSubmit(feedbackData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" style={{backgroundColor: feedbackStyle["bgColor"]}}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800" style={{color: feedbackStyle["textColor"]}}>Send your feedback</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form>
            {feedbackOptions.map((option, index) => (
              <div key={index} className="mb-2">
                <label className="flex items-center">
                  <input 
                        type="radio" 
                        name="feedback" 
                        className="form-radio h-4 w-4 text-blue-600" 
                        value={option["option_key"]}
                        checked={selectedOption === option["option_key"]}
                        onChange={(e) => setSelectedOption(option["option_key"])}/>
                  <span className="ml-2 text-gray-700" style={{color: feedbackStyle["textColor"]}}>{option["option_text"]}</span>
                </label>
              </div>
            ))}
            <div className="mt-4">
              <label className="block text-gray-700 mb-2" style={{color: feedbackStyle["textColor"]}}>Additional details (optional)</label>
              <textarea
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                rows="4"
                placeholder="Provide more details..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
              ></textarea>
            </div>
            <p className="text-xs text-gray-500 mt-2" style={{color: feedbackStyle["textColor"]}}>
              Do not include any confidential data or personally-identifiable information. Your
              feedback will be shared with Amazon Web Services and will be used to improve
              Amazon Q.
            </p>
            {/* <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeConversation}
                  onChange={() => setIncludeConversation(!includeConversation)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700" style={{color: feedbackStyle["textColor"]}}>Include my current conversation with this feedback</span>
              </label>
            </div> */}
          </form>
        </div>
        <div className="bg-gray-100 px-6 py-4 rounded-b-lg flex justify-between items-center" style={{backgroundColor: feedbackStyle["bottomColor"]}}>
          <img src={defaultLogo} alt="AWS" className="h-6" />
          <div>
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2" style={{color: feedbackStyle["textColor"]}}>
              Cancel
            </button>
            <button onClick={handleSubmit}
              disabled={!selectedOption}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;