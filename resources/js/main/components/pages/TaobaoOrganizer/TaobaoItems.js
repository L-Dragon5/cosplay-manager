// TODO: Setup filtering and search
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Box,
  Button,
  Grid,
  TextField,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Helper from '../../Helper';
import ItemCard from './ItemCard';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  filters: {
    margin: '16px 0 32px',
  },
  checkboxes: {
    marginTop: theme.spacing(2),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  paper: {
    position: 'absolute',
    width: '65%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const TaobaoItems = () => {
  const classes = useStyles();
  const token = Helper.getToken();

  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const [allItems, setAllItems] = useState(null);
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const [allTags, setAllTags] = useState(null);

  const [checkboxes, setCheckboxes] = useState({
    futureCheckbox: true,
    ownedUnwornCheckbox: true,
    wornCheckbox: true,
  });

  const [addItemUrl, setAddItemUrl] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChange = (e) => {
    setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
  };

  const handleUrlChange = (e) => {
    setAddItemUrl(e.target.value);
  };

  const handleAddItem = (e) => {
    const formData = new FormData();

    // TODO: Check for duplicate first with /api/item/check

    if (addItemUrl !== '') {
      formData.set('url', addItemUrl);
    }

    axios
      .post('/api/item/create', formData, {
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

  const getTags = () => {
    axios
      .get('/api/tags', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          const tagArray = [];

          Object.keys(response.data).forEach((index) => {
            const tag = response.data[index];
            tagArray.push({ value: tag.id, label: tag.title });
          });

          setAllTags(tagArray);
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

  const getItems = () => {
    axios
      .get('/api/items', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setAllItems(response.data);
          setItems(response.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          let message = '';

          Object.keys(error.response.data.message).forEach((key) => {
            message += `[${key}] - ${error.response.data.message[key]}\r\n`;
          });

          setErrorAlertMessage(message);
          setSnackbarStatus(true);
        }
      });
  };

  const snackbarClose = () => {
    setSnackbarStatus(false);
  };

  useEffect(() => {
    getTags();
    getItems();
    document.title = 'Taobao Organizer | CosManage';
  }, []);

  return (
    <Box className={classes.root}>
      <Typography variant="h4">Items</Typography>

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

      <Grid container className={classes.filters}>
        <Grid
          item
          xs={12}
          md={6}
          style={{ padding: '0 8px', marginBottom: '16px' }}
        >
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Add Item"
              name="add"
              variant="outlined"
              value={addItemUrl}
              onChange={handleUrlChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              component="span"
              style={{ marginTop: '16px' }}
              onClick={handleAddItem}
            >
              <AddIcon /> Add
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} style={{ padding: '0 8px' }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search"
              name="search"
              variant="outlined"
              className={classes.searchInput}
              onChange={handleSearch}
            />
          </Grid>
          <Grid item xs={12} className={classes.checkboxes}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Filters</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxes.futureCheckbox}
                      name="futureCheckbox"
                      onChange={handleChange}
                    />
                  }
                  label="Future"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxes.ownedUnwornCheckbox}
                      name="ownedUnwornCheckbox"
                      onChange={handleChange}
                    />
                  }
                  label="Owned & Unworn"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxes.wornCheckbox}
                      name="wornCheckbox"
                      onChange={handleChange}
                    />
                  }
                  label="Worn"
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      <Box className="item-grid">
        {items &&
          items.map((item) => {
            return (
              <ItemCard
                key={`i-${item.id}`}
                token={token}
                id={item.id}
                tags={item.tags}
                allTags={allTags}
                imageUrl={item.image_url}
                originalTitle={item.original_title}
                customTitle={item.custom_title}
                sellerName={item.seller_name}
                listingUrl={item.listing_url}
                notes={item.notes}
                quantity={item.quantity}
                originalPrice={item.original_price}
                isArchived={item.is_archived}
                createdAt={item.created_at}
                updatedAt={item.updated_at}
              />
            );
          })}
      </Box>
    </Box>
  );
};

export default TaobaoItems;
