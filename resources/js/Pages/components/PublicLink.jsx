import React, { useState } from 'react';
import axios from 'axios';

import { Button, Popover, TextField } from '@material-ui/core';

import Helper from './Helper';

const PublicLink = () => {
  const [publicLink, setPublicLink] = useState('');
  const [publicLinkOpen, setPublicLinkOpen] = useState(false);
  const [publicLinkAnchorEl, setPublicLinkAnchorEl] = useState(null);

  const token = Helper.getToken();

  const handlePublicLink = (e) => {
    setPublicLinkAnchorEl(e.currentTarget);

    axios
      .get('/api/account/getPublicLink', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setPublicLink(response.data.message);
          setPublicLinkOpen(true);
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

  const selectText = (e) => {
    e.target.focus();
    e.target.select();
    document.execCommand('copy');
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handlePublicLink}>
        Get Public Link
      </Button>
      <Popover
        open={publicLinkOpen}
        anchorEl={publicLinkAnchorEl}
        onClose={() => setPublicLinkOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <TextField
          variant="outlined"
          InputProps={{ readOnly: true }}
          defaultValue={publicLink}
          onClick={selectText}
        />
      </Popover>
    </>
  );
};

export default PublicLink;
