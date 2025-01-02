// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export const insertSupTags = (text, sources) => {
    const insertions = [];
  
    for (const source of sources) {
      const offsets = source.citationMarkers;
      const citationNumber = source.citationNumber;
  
      for (const { endOffset } of offsets) {
        insertions.push({ position: endOffset, citationNumber });
      }
    }
  
    const groupedInsertions = insertions.reduce((acc, { position, citationNumber }) => {
      if (!acc[position]) acc[position] = [];
      acc[position].push(citationNumber);
      return acc;
    }, {});
  
    const sortedPositions = Object.keys(groupedInsertions).sort((a, b) => b - a);    
    for (const position of sortedPositions) {
        const citations = groupedInsertions[position];
        const supTags = citations.map((num) => `<sup data-endoffset="${position}">${num}</sup>`).join('');
        text = `${text.slice(0, position)} ${supTags}${text.slice(position)}`;
    }
    
    return text;
};