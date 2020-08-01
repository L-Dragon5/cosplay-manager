import React, { useEffect, useState } from 'react';
import axios from 'axios';

import DropdownTreeSelect from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css';

const TagSelect = (props) => {
  const [data, setData] = useState();

  const { token, item, outfit, itemId, outfitId } = props;

  let apiGetRoute = 'tagsForSelect';
  let apiUpdateRoute = null;

  if ((itemId !== undefined && itemId !== null) || item) {
    apiGetRoute = `tagsByItemSelect/${itemId}`;
    apiUpdateRoute = `item/update/${itemId}`;
  } else if ((outfitId !== undefined && outfitId !== null) || outfit) {
    apiGetRoute = `tagsByOutfitSelect/${outfitId}`;
    apiUpdateRoute = `outfit/update/${outfitId}`;
  }

  const getTags = () => {
    axios
      .get(`/api/${apiGetRoute}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setData(response.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          let message = '';

          if (Array.isArray(error.response)) {
            Object.keys(error.response.data.message).forEach((key) => {
              message += `[${key}] - ${error.response.data.message[key]}\r\n`;
            });
          } else {
            message += error.response.data.message;
          }

          console.error(message);
        }
      });
  };

  const updateTags = (tags) => {
    if (apiUpdateRoute !== null) {
      const formData = new FormData();
      Object.keys(tags).forEach((key) => {
        formData.append('tags[]', tags[key]);
      });

      axios
        .post(`/api/${apiUpdateRoute}`, formData, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data',
          },
        })
        .catch((error) => {
          if (error.response) {
            let message = '';

            if (Array.isArray(error.response)) {
              Object.keys(error.response.data.message).forEach((key) => {
                message += `[${key}] - ${error.response.data.message[key]}\r\n`;
              });
            } else {
              message += error.response.data.message;
            }

            console.error(message);
          }
        });
    }
  };

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

    updateTags(returnTags);
  };

  useEffect(() => {
    getTags();
  }, []);

  if (data !== undefined) {
    return <DropdownTreeSelect data={data} onChange={handleChange} />;
  }
  return null;
};

export default TagSelect;
