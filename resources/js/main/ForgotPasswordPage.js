import React, { useCallback, useState } from 'react';
import axios from 'axios';

import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Link,
  Box,
  Grid,
  Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

// Components
import Copyright from './components/Copyright';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ForgotPasswordPage = () => {
  const classes = useStyles();

  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    axios
      .post('/api/forgot-password', formData, {
        header: {
          Accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSuccessAlertMessage(response.data.message);
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
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>

        {errorAlertMessage && (
          <Alert severity="error" style={{ whiteSpace: 'pre' }}>
            {errorAlertMessage}
          </Alert>
        )}

        {successAlertMessage && (
          <Alert severity="success">{successAlertMessage}</Alert>
        )}

        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Retrieve Password
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/login" variant="body2">
                Back to login
              </Link>
            </Grid>
            <Grid item>
              <Link href="/home" variant="body2">
                Back to home
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
