import React from 'react';
import axios from 'axios';

import { Box, Button, Grid, TextField } from '@material-ui/core';

const PasswordEditForm = (props) => {
  const { token, sendSuccess, sendError } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    axios
      .post(`/api/update-password`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          sendSuccess(response.data.message);
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

          sendError(message);
        }
      });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="old_password"
              variant="outlined"
              label="Old Password"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="new_password"
              variant="outlined"
              label="New Password"
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="secondary">
              Change Password
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PasswordEditForm;
