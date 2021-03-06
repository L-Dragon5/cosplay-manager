import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Box, Fab, Modal, Typography, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Helper from '../../Helper';
import Character from './Character';
import CharacterAddForm from './forms/CharacterAddForm';

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

const CharacterGrid = (props) => {
  const classes = useStyles();
  const token = Helper.getToken();

  const [seriesTitle, setSeriesTitle] = useState(null);
  const [characters, setCharacters] = useState(null);
  const [renderForm, setRenderForm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [successAlertMessage, setSuccessAlertMessage] = useState('');

  const seriesID =
    props.match.params.series !== undefined ? props.match.params.series : null;

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

  const getCharacters = () => {
    axios
      .get(`/api/characters/${seriesID}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setCharacters(response.data);
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
    getCharacters();
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
    getCharacters();
  }, []);

  useEffect(() => {
    if (seriesTitle !== null) {
      document.title = `[${seriesTitle}] Characters | CosManage`;
    } else {
      document.title = '[Unknown] Characters | CosManage';
    }
  }, [seriesTitle]);

  return (
    <Box className={classes.root}>
      <Typography variant="h4" className={classes.heading}>
        {seriesTitle}
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

      <Box className="character-grid">
        {characters &&
          characters.map((item) => {
            return (
              <Character
                key={`c-${item.id}`}
                token={token}
                id={item.id}
                seriesID={seriesID}
                name={item.name}
                image={item.image}
                outfitCount={item.outfit_count}
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
        Add Character
      </Fab>

      {renderForm ? (
        <Modal
          open={modalStatus}
          onClose={modalClose}
          disableEnforceFocus
          disableAutoFocus
        >
          <Box className={classes.paper}>
            <CharacterAddForm
              token={token}
              seriesID={seriesID}
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

export default CharacterGrid;
