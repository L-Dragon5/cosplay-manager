import React, { useCallback } from 'react'
import axios from 'axios'

import { Avatar, Button, Container, CssBaseline, TextField, Link, Box, Grid, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

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

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
  
      const formData = new FormData(e.target)
  
      axios.post('/api/forgot-password', formData, {
        header: {
          Accept: 'application/json',
          'content-type': 'multipart/form-data'
        }
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data.message);
        }
      }).catch((error) => {
        if (error.response) {
          console.error(error.response.data.message);
        }
      });
    }, [],
  );

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
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
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
