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
import Helper from './components/Helper';
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

const RegisterPage = () => {
  const classes = useStyles();

  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const passToken = (data) => {
    if (Helper.setToken(data)) {
      window.location.replace('/dashboard');
    } else {
      alert(
        "Your browser doesn't support the login storage option. Please use an updated browser.",
      );
    }
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    axios
      .post('/api/register', formData, {
        header: {
          Accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 201) {
          passToken(response.data.message);
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
          Register
        </Typography>

        {errorAlertMessage && (
          <Alert severity="error" style={{ whiteSpace: 'pre' }}>
            {errorAlertMessage}
          </Alert>
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
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="c_password"
                label="Confirm Password"
                type="password"
                id="c_password"
              />
            </Grid>
            <Grid item xs={12}>
              <div
                className="g-recaptcha"
                name="g-recaptcha-response"
                data-sitekey={process.env.MIX_GOOGLE_RECAPTCHA_KEY}
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
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

export default RegisterPage;
