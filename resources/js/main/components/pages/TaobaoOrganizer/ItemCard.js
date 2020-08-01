import React, { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';

import {
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Snackbar,
  Modal,
  Box,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Components
import Tag from '../../Tag';
import ItemEditFrom from './forms/ItemEditForm';

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
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
  archivedItem: {
    border: '2px solid red',
    opacity: '75%',
  },
}));

const ItemCard = (props) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [renderForm, setRenderForm] = useState(true);
  const [modalStatus, setModalStatus] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  // Editable Settings
  const [customTitle, setCustomTitle] = useState(
    props.customTitle !== undefined ? props.customTitle : null,
  );
  const [notes, setNotes] = useState(
    props.notes !== undefined ? props.notes : null,
  );
  const [quantity, setQuantity] = useState(
    props.quantity !== undefined && props.quantity !== null
      ? parseInt(props.quantity, 10)
      : -1,
  );
  const [isArchived, setIsArchived] = useState(
    props.isArchived !== undefined && props.isArchived !== null
      ? props.isArchived
      : false,
  );
  const [tags, setTags] = useState(
    props.tags !== undefined && props.tags !== null ? props.tags : [],
  );

  // Uneditable Settings
  const {
    token,
    id,
    originalTitle,
    imageUrl,
    sellerName,
    listingUrl,
    originalPrice,
  } = props;

  let { createdAt, updatedAt } = props;

  // Convert timestamps to readable times
  createdAt =
    createdAt !== null ? new Date(createdAt).toLocaleDateString() : null;
  updatedAt =
    updatedAt !== null ? new Date(updatedAt).toLocaleDateString() : null;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete this item [${
          customTitle !== null ? customTitle : originalTitle
        }]? This action is not reversible.`,
      )
    ) {
      axios
        .get(`/api/item/destroy/${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setSuccessAlertMessage(response.data.message);
            setVisible(false);
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
    }
  };

  const handleArchive = () => {
    axios
      .get(`/api/item/archive/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setIsArchived(true);
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
  const handleUnarchive = () => {
    axios
      .get(`/api/item/unarchive/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setIsArchived(false);
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

  const handleFormUnmount = (data) => {
    const obj = JSON.parse(data);
    if (obj) {
      setCustomTitle(obj.custom_title);
      setQuantity(obj.quantity);
      setNotes(obj.notes);
      setTags(obj.tags !== undefined ? obj.tags : []);

      setRenderForm(false);
    }
  };

  const handleFormSendSuccess = (data) => {
    setSuccessAlertMessage(data);
    setSnackbarStatus(true);
  };

  const handleFormSendError = (data) => {
    setErrorAlertMessage(data);
    setSnackbarStatus(true);
  };

  const modalOpen = (e) => {
    e.stopPropagation();

    setRenderForm(true);
    setModalStatus(true);
  };

  const modalClose = () => {
    setModalStatus(false);
  };

  const snackbarClose = () => {
    setSnackbarStatus(false);
  };

  if (visible) {
    let tagsDisplay = '';

    if (tags.length > 0) {
      tagsDisplay = (
        <Box className="item__tags">
          {tags.map((item, i) => {
            return <Tag key={`${item.label}-${i}`}>{item.label}</Tag>;
          })}
        </Box>
      );
    }

    return (
      <>
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

        <Card className={`${isArchived ? classes.archivedItem : ''} item`}>
          <CardHeader
            title={
              customTitle !== null && customTitle !== ''
                ? customTitle
                : originalTitle
            }
            subheader={tagsDisplay}
            className="item__header"
          />

          <CardMedia component="img" image={imageUrl} />

          {notes && (
            <CardContent>
              <Box>{notes}</Box>
            </CardContent>
          )}

          <CardActions disableSpacing>
            <IconButton aria-label="edit" title="Edit" onClick={modalOpen}>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              title="Delete"
              onClick={handleDelete}
            >
              <DeleteForeverIcon />
            </IconButton>
            {isArchived ? (
              <IconButton
                aria-label="unacrhive"
                title="Unarchive"
                onClick={handleUnarchive}
              >
                <UnarchiveIcon />
              </IconButton>
            ) : (
              <IconButton
                aria-label="archive"
                title="Archive"
                onClick={handleArchive}
              >
                <ArchiveIcon />
              </IconButton>
            )}
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show details"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {customTitle !== null && customTitle !== '' && (
                <Typography variant="body1">
                  <strong>Original Title:</strong> {originalTitle}
                </Typography>
              )}
              <Typography variant="body1">
                <strong>Seller:</strong> {sellerName}
              </Typography>
              <Typography variant="body1">
                <strong>Price:</strong> {originalPrice}
              </Typography>
              <Typography variant="body1">
                <strong>Quantity:</strong> {quantity}
              </Typography>
              <Typography variant="body1">
                <strong>Created At:</strong> {createdAt}
              </Typography>
              <Typography variant="body1">
                <strong>Updated At:</strong> {updatedAt}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                href={listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: '8px' }}
              >
                Original Listing
              </Button>
            </CardContent>
          </Collapse>
        </Card>

        {renderForm ? (
          <Modal
            open={modalStatus}
            onClose={modalClose}
            disableEnforceFocus
            disableAutoFocus
          >
            <Box className={classes.paper}>
              <ItemEditFrom
                token={token}
                id={id}
                customTitle={customTitle}
                quantity={quantity}
                notes={notes}
                unmount={handleFormUnmount}
                sendSuccess={handleFormSendSuccess}
                sendError={handleFormSendError}
              />
            </Box>
          </Modal>
        ) : null}
      </>
    );
  }

  return null;
};

export default ItemCard;
