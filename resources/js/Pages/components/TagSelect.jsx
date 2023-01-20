import 'react-dropdown-tree-select/dist/styles.css';

import React from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';

function TagSelect({ tags, setData }) {
  const recursiveReturnIds = (node) => {
    let ids = [];

    if (Array.isArray(node)) {
      Object.keys(node).forEach((key) => {
        if (node[key].value !== undefined) {
          ids.push(node[key].value);
        } else {
          ids.push(node[key]);
        }

        if (node[key]._children !== undefined) {
          ids = [...ids, ...recursiveReturnIds(node[key]._children)];
        }
      });

      return ids;
    }

    return [];
  };

  const handleChange = (currentNode, selectedNodes) => {
    let returnTags = [];

    if (Array.isArray(selectedNodes)) {
      returnTags = recursiveReturnIds(selectedNodes);
    }

    setData('tags', returnTags);
  };

  return <DropdownTreeSelect data={tags} onChange={handleChange} />;
}

export default React.memo(TagSelect);
