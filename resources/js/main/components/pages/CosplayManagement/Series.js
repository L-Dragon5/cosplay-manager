import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { Modal, Box, Typography, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { teal, red } from '@material-ui/core/colors';

import SeriesEditForm from './forms/SeriesEditForm';

const useStyles = makeStyles((theme) => ({
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

const Series = (props) => {
  const history = useHistory();
  const classes = useStyles();

  const { token } = props;
  let { id, characterCount } = props;

  id = id !== undefined ? id : null;
  characterCount =
    characterCount !== undefined && characterCount !== null
      ? characterCount
      : 0;

  const [visible, setVisible] = useState(true);
  const [title, setTitle] = useState(
    props.title !== undefined ? props.title : 'ERROR',
  );
  const [image, setImage] = useState(props.image);
  const [renderForm, setRenderForm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const handleClick = () => {
    history.push(`/cosplay-management/s-${id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();

    if (
      confirm(
        `Are you sure you want to delete this series [${title}]? This will delete all characters and outfit in this series and is not reversible.`,
      )
    ) {
      let answer = null;
      if (characterCount !== 0) {
        answer = prompt(
          `You have ${
            characterCount +
            (characterCount === 1 ? ' character' : ' characters')
          } under this Series. Please enter DELETE to confirm.`,
        );
      } else {
        answer = 'DELETE';
      }

      if (answer === 'DELETE') {
        axios
          .get(`/api/series/destroy/${id}`, {
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
        setSnackbarStatus(true);
      }
    }
  };

  const handleFormUnmount = (data) => {
    const obj = JSON.parse(data);
    if (obj) {
      setTitle(obj.title);
      setImage(obj.image);
    }

    setRenderForm(false);
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
    setSuccessAlertMessage('');
    setErrorAlertMessage('');
  };

  if (visible) {
    if (title && image) {
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

          <Box className="series" onClick={handleClick}>
            <Box className="series__image">
              <img src={image} draggable={false} alt="" />
            </Box>
            <Box className="series__title">
              <Box
                onClick={modalOpen}
                className="series__icon"
                style={{ backgroundColor: teal[300] }}
              >
                <EditIcon />
              </Box>

              <Box className="series__title__text">
                <Typography>{title}</Typography>
                <Typography>
                  {characterCount +
                    (characterCount === 1 ? ' Character' : ' Characters')}
                </Typography>
              </Box>

              <Box
                onClick={handleDelete}
                className="series__icon"
                style={{ backgroundColor: red[300] }}
              >
                <DeleteIcon />
              </Box>
            </Box>
          </Box>

          {renderForm ? (
            <Modal
              open={modalStatus}
              onClose={modalClose}
              disableEnforceFocus
              disableAutoFocus
            >
              <div className={classes.paper}>
                <SeriesEditForm
                  token={token}
                  id={id}
                  title={title}
                  unmount={handleFormUnmount}
                  sendSuccess={handleFormSendSuccess}
                  sendError={handleFormSendError}
                />
              </div>
            </Modal>
          ) : null}
        </>
      );
    }
  }

  return null;
};

export default Series;
