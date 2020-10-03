import React, { useState, useRef } from 'react';
import axios from 'axios';
import Cropper from 'react-cropper';

import { Box, Button, Grid, TextField } from '@material-ui/core';

const SeriesAddForm = (props) => {
  const [image, setImage] = useState(null);
  const [saveImage, setSaveImage] = useState(null);

  const cropper = useRef();

  const { token, unmount, sendSuccess, sendError } = props;

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
          sendSuccess(response.data.message);
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

          sendError(message);
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

  const getImageFromUrl = () => {
    const url = prompt('Enter URL here');

    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

  return (
    <Box>
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
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              component="span"
              onClick={getImageFromUrl}
            >
              Get Image from URL
            </Button>
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
