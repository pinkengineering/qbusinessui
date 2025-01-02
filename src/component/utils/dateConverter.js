// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export const formatDate = (date) => {
    const givenDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    // Reset time portions for accurate comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    givenDate.setHours(0, 0, 0, 0);
  
    if (givenDate.getTime() === today.getTime()) {
      return "Today";
    } else if (givenDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      // Default formatting for other dates
      return givenDate.toLocaleDateString('en-US', {
        month: 'short', // "Oct"
        day: '2-digit', // "18"
      });
    }
};

export const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
});