import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Box, Fab, Modal, Typography, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Helper from '../../Helper';
import OutfitCard from './OutfitCard';
import OutfitAddForm from './forms/OutfitAddForm';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  heading: {
    marginBottom: '16px',
  },
  fab: {
    position: 'fixed',
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

const OutfitGrid = (props) => {
  const classes = useStyles();
  const token = Helper.getToken();

  const seriesID =
    props.match.params.series !== undefined ? props.match.params.series : null;
  const characterID =
    props.match.params.character !== undefined
      ? props.match.params.character
      : null;

  const [seriesTitle, setSeriesTitle] = useState(null);
  const [characterName, setCharacterName] = useState(null);
  const [outfits, setOutfits] = useState(null);
  const [renderForm, setRenderForm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const getSeriesTitle = () => {
    axios
      .get(`/api/series/${seriesID}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setSeriesTitle(response.data.title);
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

  const getCharacterName = () => {
    axios
      .get(`/api/character/${characterID}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setCharacterName(response.data.name);
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

  const getOutfits = () => {
    axios
      .get(`/api/outfits/${characterID}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setOutfits(response.data);
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

  const handleFormUnmount = () => {
    setRenderForm(false);
    getOutfits();
  };

  const handleFormSendSuccess = (data) => {
    setSuccessAlertMessage(data);
    setSnackbarStatus(true);
  };

  const handleFormSendError = (data) => {
    setErrorAlertMessage(data);
    setSnackbarStatus(true);
  };

  const modalOpen = () => {
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

  useEffect(() => {
    getSeriesTitle();
    getCharacterName();
    getOutfits();
  }, []);

  useEffect(() => {
    if (seriesTitle !== null && characterName !== null) {
      document.title = `[${seriesTitle}] ${characterName} | CosManage`;
    } else if (seriesTitle !== null && characterName === null) {
      document.title = `[${seriesTitle}] Character Name | CosManage`;
    } else if (seriesTitle === null && characterName !== null) {
      document.title = `[Unknown] ${characterName} | CosManage`;
    } else {
      document.title = '[Unknown] Characters Name | CosManage';
    }
  }, [seriesTitle, characterName]);

  return (
    <Box className={classes.root}>
      <Typography variant="h4" className={classes.heading}>
        {seriesTitle} - {characterName}
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

      <Box className="outfit-grid">
        {outfits &&
          outfits.map((item, key) => {
            return (
              <OutfitCard
                key={`o-${item.id}`}
                token={token}
                id={item.id}
                title={item.title}
                images={item.images}
                status={item.status}
                obtained_on={item.obtained_on}
                creator={item.creator}
                storage_location={item.storage_location}
                times_worn={item.times_worn}
                tags={item.tags}
              />
            );
          })}
      </Box>

      <Fab
        className={classes.fab}
        color="secondary"
        variant="extended"
        aria-label="add"
        onClick={modalOpen}
      >
        <AddIcon />
        Add Outfit
      </Fab>

      {renderForm ? (
        <Modal
          open={modalStatus}
          onClose={modalClose}
          disableEnforceFocus
          disableAutoFocus
        >
          <Box className={classes.paper}>
            <OutfitAddForm
              token={token}
              characterID={characterID}
              unmount={handleFormUnmount}
              sendSuccess={handleFormSendSuccess}
              sendError={handleFormSendError}
            />
          </Box>
        </Modal>
      ) : null}
    </Box>
  );
};

export default OutfitGrid;
