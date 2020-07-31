import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Box, Snackbar, Typography } from '@material-ui/core';
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
  heading: {
    marginBottom: '16px',
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

  const [items, setItems] = useState(null);
  const [allTags, setAllTags] = useState(null);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

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
      <Typography variant="h4" className={classes.heading}>
        Items
      </Typography>

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
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
              />
            );
          })}
      </Box>
    </Box>
  );
};

export default TaobaoItems;
