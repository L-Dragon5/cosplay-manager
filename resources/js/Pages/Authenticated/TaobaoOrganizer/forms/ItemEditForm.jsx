import React from 'react';
import axios from 'axios';

import { Box, Button, Grid, TextField } from '@material-ui/core';

import TagSelect from '../../../TagSelect';

const ItemEditForm = (props) => {
  const {
    token,
    id,
    customTitle,
    quantity,
    notes,
    unmount,
    sendSuccess,
    sendError,
  } = props;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    axios
      .post(`/api/item/update/${id}`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          sendSuccess(response.data.message);
          unmount(JSON.stringify(response.data.item));
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
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              name="custom_title"
              variant="outlined"
              label="Custom Title"
              defaultValue={customTitle}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <TagSelect token={token} itemId={id} />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              required
              fullWidth
              type="number"
              name="quantity"
              variant="outlined"
              label="Quantity"
              defaultValue={quantity}
              InputProps={{
                inputProps: {
                  max: 99,
                  min: 0,
                },
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              multiline
              name="notes"
              variant="outlined"
              label="Notes"
              defaultValue={notes}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="secondary">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ItemEditForm;
