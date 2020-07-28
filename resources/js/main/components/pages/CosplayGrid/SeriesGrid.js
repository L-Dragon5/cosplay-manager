import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Fab, Modal, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Helper from '../../Helper';
import Series from './Series';
import SeriesAddForm from '../../forms/SeriesAddForm';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
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

const SeriesGrid = () => {
  const classes = useStyles();

  const [series, setSeries] = useState(null);
  const [renderForm, setRenderForm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [token, setToken] = useState(Helper.getToken());
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
          setRenderForm(true);
        }
      })
      .catch((error) => {
        if (error.response) {
          let message = '';

          Object.keys(error.response.data.message).forEach((key) => {
            message += `[${key}] - ${error.response.data.message[key]}\r\n`;
          });

          setErrorAlertMessage(message);
        }
      });
  };

  const handleFormUnmount = () => {
    setRenderForm(false);
    getSeries();
  };

  const modalOpen = () => {
    setRenderForm(true);
    setModalStatus(true);
  };

  const modalClose = () => {
    setModalStatus(false);
  };

  useEffect(() => {
    getSeries();
    document.title = 'Series Grid | CosManage';
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h4">Series</Typography>

      {errorAlertMessage && (
        <Alert severity="error" style={{ whiteSpace: 'pre' }}>
          {errorAlertMessage}
        </Alert>
      )}

      <div className="series-grid">
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
      </div>

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
          <div className={classes.paper}>
            <SeriesAddForm token={token} unmount={handleFormUnmount} />
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default SeriesGrid;
