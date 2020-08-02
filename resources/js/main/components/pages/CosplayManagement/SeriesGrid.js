import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Box, Fab, Modal, Typography, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Helper from '../../Helper';
import Series from './Series';
import SeriesAddForm from './forms/SeriesAddForm';

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

const SeriesGrid = () => {
  const classes = useStyles();
  const token = Helper.getToken();

  const [series, setSeries] = useState(null);
  const [renderForm, setRenderForm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const getSeries = () => {
    axios
      .get('/api/series', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setSeries(response.data);
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
    getSeries();
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
    getSeries();
    document.title = 'Series Grid | CosManage';
  }, []);

  return (
    <Box className={classes.root}>
      <Typography variant="h4" className={classes.heading}>
        Series
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

      <Box className="series-grid">
        {series &&
          series.map((item) => {
            return (
              <Series
                key={`s-${item.id}`}
                token={token}
                id={item.id}
                title={item.title}
                image={item.image}
                characterCount={item.character_count}
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
        Add Series
      </Fab>

      {renderForm ? (
        <Modal
          open={modalStatus}
          onClose={modalClose}
          disableEnforceFocus
          disableAutoFocus
        >
          <Box className={classes.paper}>
            <SeriesAddForm
              token={token}
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

export default SeriesGrid;
