import React, { useState, useRef } from 'react';
import axios from 'axios';
import Cropper from 'react-cropper';

import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';

import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const OutfitEditForm = (props) => {
  const [image, setImage] = useState(null);
  const [saveImage, setSaveImage] = useState(null);
  const [status, setStatus] = useState(props.status);

  const cropper = useRef();
  const animatedComponents = makeAnimated();

  const {
    token,
    id,
    title,
    obtained_on,
    creator,
    storage_location,
    times_worn,
    options,
    tags,
    unmount,
    sendSuccess,
    sendError,
  } = props;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.set('status', status);

    if (saveImage !== null) {
      formData.set('image', saveImage);
    }

    axios
      .post(`/api/outfit/update/${id}`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          sendSuccess(response.data.message);
          unmount(JSON.stringify(response.data.outfit));
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

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
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
              label="Outfit Title"
              defaultValue={title}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="outfit-status">Outfit Status</InputLabel>
              <Select
                fullWidth
                labelId="outfit-status"
                defaultValue={status}
                value={status}
                onChange={handleStatusChange}
                label="Outfit Status"
                required
              >
                <MenuItem value={0}>Future Cosplay</MenuItem>
                <MenuItem value={1}>Owned & Unworn</MenuItem>
                <MenuItem value={2}>Worn</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="creator"
              variant="outlined"
              label="Creator"
              defaultValue={creator}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="storage_location"
              variant="outlined"
              label="Storage Location"
              defaultValue={storage_location}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              multiline
              name="times_worn"
              variant="outlined"
              label="Times Worn"
              defaultValue={times_worn}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="obtained_on"
              type="date"
              defaultValue={obtained_on}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CreatableSelect
              isMulti
              isClearable={false}
              name="tags[]"
              closeMenuOnSelect={false}
              components={animatedComponents}
              placeholder="Select tags"
              options={options}
              defaultValue={tags}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label htmlFor={`image-${id}`}>
              <input
                id={`image-${id}`}
                type="file"
                name="image"
                accept="image/*"
                onChange={getBase64}
                style={{ display: 'none' }}
              />
              <Button variant="contained" color="primary" component="span">
                Add Image
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
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default OutfitEditForm;
