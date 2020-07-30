import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Box, Snackbar, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Helper from '../../Helper';

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

const TaobaoItems = () => {
  const classes = useStyles();
  const token = Helper.getToken();

  const [series, setSeries] = useState(null);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
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
    getSeries();
    document.title = 'Taobao Organizer | CosManage';
  }, []);

  return (
    <Box className={classes.root}>
      <Typography variant="h4">Series</Typography>

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

      <div className="series-grid">
        {series &&
          series.map((item) => {
            return (
              <Box
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
    </Box>
  );
};

export default TaobaoItems;
