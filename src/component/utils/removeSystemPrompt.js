// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { visit } from 'unist-util-visit';

const removeInstructionsPlugin = () => (tree) => {
  visit(tree, 'html', (node, index, parent) => {
    // Use regex to detect <system>...</system> and remove the entire block
    const systemTagRegex = /<system>[\s\S]*?<\/system>/;

    if (systemTagRegex.test(node.value)) {
      parent.children.splice(index, 1); // Remove the entire node
    }
  });
};

export default removeInstructionsPlugin;