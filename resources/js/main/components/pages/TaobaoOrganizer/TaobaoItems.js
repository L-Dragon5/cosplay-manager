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
  const [filter, setFilter] = useState(3); // Filter mask for active/archive (active = 1, archive = 2)

  const [checkboxes, setCheckboxes] = useState({
    activeItemsCheckbox: true,
    archivedItemsCheckbox: true,
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

  const snackbarClose = () => {
    setSnackbarStatus(false);
  };

  // Set outfits based on search and filters.
  const filterItems = () => {
    const lowerSearch = String(search).toLowerCase();

    if (allItems !== null) {
      switch (filter) {
        case 0: // None
          setItems(null);
          break;
        case 1: // Active Only
          setItems(
            allItems.filter(
              (item) =>
                item.is_archived === 0 &&
                (String(item.custom_title)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                  String(item.original_title)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1),
            ),
          );
          break;
        case 2: // Archive Only
          setItems(
            allItems.filter(
              (item) =>
                item.is_archived === 1 &&
                (String(item.custom_title)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                  String(item.original_title)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1),
            ),
          );
          break;
        case 3: // Active & Archive
          setItems(
            allItems.filter(
              (item) =>
                String(item.custom_title).toLowerCase().indexOf(lowerSearch) !==
                  -1 ||
                String(item.original_title)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1,
            ),
          );
          break;
        default:
          break;
      }
    }
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
          filterItems();
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

  const handleAddItem = () => {
    const formData = new FormData();

    if (addItemUrl !== '') {
      formData.set('url', addItemUrl);
    }

    axios
      .post('/api/item/check', formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      })
      .then((checkResponse) => {
        if (checkResponse.status === 200) {
          if (checkResponse.data.message.exists === true) {
            if (
              confirm('This item already exists. Would you like to re-add?')
            ) {
            } else {
              setAddItemUrl('');
              return;
            }
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
                getItems();
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
            })
            .finally(() => {
              setAddItemUrl('');
            });
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

  // Set filter mask based on checkboxes.
  useEffect(() => {
    let mask = 0;

    if (checkboxes.activeItemsCheckbox) {
      mask += 1;
    }

    if (checkboxes.archivedItemsCheckbox) {
      mask += 2;
    }

    setFilter(mask);
  }, [checkboxes]);

  useEffect(() => {
    filterItems();
  }, [filter, search]);

  useEffect(() => {
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
              placeholder="Enter http links here..."
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
              <AddIcon /> Add Item
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
                      checked={checkboxes.activeItemsCheckbox}
                      name="activeItemsCheckbox"
                      onChange={handleChange}
                    />
                  }
                  label="Active Items"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxes.archivedItemsCheckbox}
                      name="archivedItemsCheckbox"
                      onChange={handleChange}
                    />
                  }
                  label="Archived Items"
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
