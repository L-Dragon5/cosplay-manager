import React, { useState } from 'react';
import axios from 'axios';

import { Box, Button, Grid, TextField, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const ItemEditForm = (props) => {
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const animatedComponents = makeAnimated();

  const {
    token,
    id,
    customTitle,
    quantity,
    notes,
    allTags,
    tags,
    unmount,
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
          setSuccessAlertMessage(response.data.message);
          setSnackbarStatus(true);
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

          setErrorAlertMessage(message);
          setSnackbarStatus(true);
        }
      });
  };

  const snackbarClose = () => {
    setSnackbarStatus(false);
  };

  return (
    <Box>
      {errorAlertMessage && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={snackbarStatus}
          onClose={snackbarClose}
          autoHideDuration={2000}
        >
          <Alert severity="error" style={{ whiteSpace: 'pre' }}>
            {errorAlertMessage}
          </Alert>
        </Snackbar>
      )}

      {successAlertMessage && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={snackbarStatus}
          onClose={snackbarClose}
          autoHideDuration={2000}
        >
          <Alert severity="success">{successAlertMessage}</Alert>
        </Snackbar>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              required
              fullWidth
              name="custom_title"
              variant="outlined"
              label="Custom Title"
              defaultValue={customTitle}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <CreatableSelect
              isMulti
              isClearable={false}
              name="tags[]"
              closeMenuOnSelect={false}
              components={animatedComponents}
              placeholder="Select tags"
              options={allTags}
              defaultValue={tags}
            />
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
