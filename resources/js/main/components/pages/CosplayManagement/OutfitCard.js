import React, { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import Carousel from 'react-material-ui-carousel';

import {
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
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Components
import Tag from '../../Tag';
import OutfitEditForm from './forms/OutfitEditForm';

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
}));

const OutfitCard = (props) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [renderForm, setRenderForm] = useState(true);
  const [renderCarousel, setRenderCarousel] = useState(true);
  const [modalStatus, setModalStatus] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const [title, setTitle] = useState(
    props.title !== undefined ? props.title : 'Error',
  );
  const [images, setImages] = useState(props.images);
  const [status, setStatus] = useState(
    props.status !== undefined ? parseInt(props.status, 10) : -1,
  );
  const [obtainedOn, setObtainedOn] = useState(
    props.obtained_on !== undefined && props.obtained_on !== null
      ? props.obtained_on
      : null,
  );
  const [creator, setCreator] = useState(
    props.creator !== undefined && props.creator !== null
      ? props.creator
      : null,
  );
  const [storageLocation, setStorageLocation] = useState(
    props.storage_location !== undefined &&
      props.storage_location !== null &&
      props.storage_location.length
      ? props.storage_location
      : null,
  );
  const [timesWorn, setTimesWorn] = useState(
    props.times_worn !== undefined && props.times_worn !== null
      ? props.times_worn
      : null,
  );
  const [tags, setTags] = useState(
    props.tags !== undefined && props.tags !== null ? props.tags : [],
  );
  const [allTags, setAllTags] = useState(
    props.allTags !== undefined && props.allTags !== null ? props.allTags : [],
  );

  const { token } = props;
  const id = props.id !== undefined ? props.id : null;
  const characterName =
    props.character_name !== undefined ? props.character_name : null;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDelete = (e) => {
    e.stopPropagation();

    if (
      confirm(
        `Are you sure you want to delete this outfit [${title}]? This action is not reversible.`,
      )
    ) {
      const answer = prompt('Please enter DELETE to confirm.');

      if (answer === 'DELETE') {
        axios
          .get(`/api/outfit/destroy/${id}`, {
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
      } else {
        setErrorAlertMessage('Deletion cancelled');
      }
    }
  };

  const handleFormUnmount = (data) => {
    const obj = JSON.parse(data);
    if (obj) {
      setTitle(obj.title);
      setImages(obj.images);
      setStatus(
        obj.status !== undefined && obj.status.length
          ? parseInt(obj.status, 10)
          : -1,
      );
      setObtainedOn(
        obj.obtained_on !== undefined && obj.obtained_on !== null
          ? obj.obtained_on
          : null,
      );
      setCreator(
        obj.creator !== undefined && obj.creator !== null ? obj.creator : null,
      );
      setStorageLocation(
        obj.storage_location !== undefined &&
          obj.storage_location !== null &&
          obj.storage_location.length
          ? obj.storage_location
          : null,
      );
      setTimesWorn(
        obj.times_worn !== undefined && obj.times_worn !== null
          ? obj.times_worn
          : null,
      );
      setTags(obj.tags !== undefined ? obj.tags : []);

      setRenderForm(false);
    }
  };

  const handleRemovePhoto = (e, index) => {
    e.stopPropagation();

    axios
      .get(`/api/outfit/${id}/deleteImage/${index}`, {
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
          setImages(response.data.images);
          setRenderCarousel(true);
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
    let statusClass = '';
    // 0 = Future Cosplay, 1 = Owned & Unworn, 2 = Worn
    if (status === 0) {
      statusClass = 'outfit--future';
    } else if (status === 1) {
      statusClass = 'outfit--unworn';
    } else if (status === 2) {
      statusClass = 'outfit--worn';
    }

    let obtainedOnFormatted = '';

    if (obtainedOn !== null) {
      const d = new Date(obtainedOn);
      const month = d.toLocaleString('default', { month: 'long' });
      obtainedOnFormatted = `${month} ${d.getDate()}, ${d.getFullYear()}`;
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

        <Card className={`outfit ${statusClass}`}>
          <CardHeader title={title} subheader={characterName} />

          <CardMedia className="carousel">
            {renderCarousel ? (
              <Carousel autoPlay={false} indicators={false} timeout={150}>
                {images.map((item, i) => {
                  return (
                    <Box key={`${title}-image-${i}`}>
                      <img
                        src={item}
                        className="outfit__image"
                        alt=""
                        draggable={false}
                      />
                      <Box
                        className="outfit__image__delete"
                        onClick={(e) => {
                          setRenderCarousel(false);
                          handleRemovePhoto(e, i);
                        }}
                      >
                        <DeleteIcon />
                      </Box>
                    </Box>
                  );
                })}
              </Carousel>
            ) : (
              <></>
            )}
          </CardMedia>

          {tags.length > 0 ? (
            <CardContent>
              <Box className="outfit__tags">
                {tags.map((item, i) => {
                  return <Tag key={`${item.label}-${i}`}>{item.label}</Tag>;
                })}
              </Box>
            </CardContent>
          ) : null}

          <CardActions disableSpacing>
            <IconButton aria-label="edit" onClick={modalOpen}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={handleDelete}>
              <DeleteForeverIcon />
            </IconButton>
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
              <Typography variant="body1">
                <strong>Obtained On:</strong> {obtainedOnFormatted}
              </Typography>
              <Typography variant="body1">
                <strong>Creator:</strong> {creator}
              </Typography>
              <Typography variant="body1">
                <strong>Storage Location:</strong> {storageLocation}
              </Typography>
              <Typography variant="body1">
                <strong>Times Worn:</strong> {timesWorn}
              </Typography>
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
              <OutfitEditForm
                token={token}
                id={id}
                title={title}
                status={status}
                obtained_on={obtainedOn}
                creator={creator}
                storage_location={storageLocation}
                times_worn={timesWorn}
                tags={tags}
                options={allTags}
                unmount={handleFormUnmount}
              />
            </Box>
          </Modal>
        ) : null}
      </>
    );
  }

  return null;
};

export default OutfitCard;
