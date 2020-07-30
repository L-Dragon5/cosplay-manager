import React, { useState, useRef } from 'react';
import axios from 'axios';
import Cropper from 'react-cropper';

import { Box, Button, Grid, TextField, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const SeriesAddForm = (props) => {
  const [image, setImage] = useState(null);
  const [saveImage, setSaveImage] = useState(null);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const cropper = useRef();

  const { token, unmount } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (saveImage !== null) {
      formData.set('image', saveImage);
    }

    axios
      .post('/api/series/create', formData, {
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
          unmount();
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

  const cropImage = () => {
    setSaveImage(cropper.current.getCroppedCanvas().toDataURL());
  };

  const getBase64 = (e) => {
    const node = e.currentTarget;

    if (node.files !== null && node.files.length > 0) {
      const tempImage = node.files[0];
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        (evt) => {
          setImage(evt.target.result);
        },
        false,
      );

      if (tempImage) {
        reader.readAsDataURL(tempImage);
      }
    }
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
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="title"
              variant="outlined"
              label="Series Title"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label htmlFor="image">
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={getBase64}
                style={{ display: 'none' }}
              />
              <Button variant="contained" color="primary" component="span">
                Upload Image
              </Button>
            </label>
          </Grid>

          {image && (
            <Grid item xs={12} style={{ marginBottom: '1rem' }}>
              <Cropper
                ref={cropper}
                viewMode={1}
                src={image}
                style={{ maxHeight: 350 }}
                guides={false}
                autoCropArea={1}
                movable={false}
                zoomable={false}
                scalable={false}
                rotatable={false}
                crop={cropImage}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="secondary">
              Add Series
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SeriesAddForm;
