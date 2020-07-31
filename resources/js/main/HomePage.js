import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import {
  Button,
  CssBaseline,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Copyright from './components/Copyright';

const useStyles = makeStyles((theme) => ({
  intro: {
    height: '100vh',
    width: '100%',
  },
  image: {
    backgroundImage: 'url(/storage/organized-bg.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.75)',
    height: '100%',
    width: '100%',
    top: '0',
  },
  introContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
    textAlign: 'center',
  },
  introSubtitle: {
    marginTop: '16px',
  },
  introButtons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: '32px',
  },
  features: {
    height: '100vh',
    width: '100%',
    padding: '32px',
  },
  about: {
    width: '100%',
    padding: '32px',
  },
  footer: {
    width: '100%',
    padding: '16px',
    color: '#fff',
    background:
      'linear-gradient(180deg, rgba(255,153,0,1) 0%, rgba(255,106,0,1) 100%)',
  },
  changelog: {
    maxHeight: '600px',
    overflowY: 'auto',
    padding: theme.spacing(2),
    paddingTop: '0',
    color: theme.palette.text.primary,
  },
}));

const HomePage = () => {
  const classes = useStyles();

  const [changelog, setChangelog] = useState(null);

  useEffect(() => {
    document.title = 'Dashboard | CosManage';

    fetch(
      'https://raw.githubusercontent.com/L-Dragon5/cosplay-manager/v2/CHANGELOG.md',
    )
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Error reading from github.');
      })
      .then((data) => {
        setChangelog(data);
      });
  }, []);

  return (
    <>
      <CssBaseline />
      <Grid container component="main" className={classes.root}>
        <Box className={classes.intro}>
          <Box className={classes.image} />
          <Box className={classes.overlay} />
          <Box className={classes.introContent}>
            <Typography component="h1" variant="h2">
              Get Organized
            </Typography>
            <Typography variant="subtitle1" className={classes.introSubtitle}>
              CosManage is a collection of tools to help you organize your
              cosplay plans and projects.
            </Typography>

            <Box className={classes.introButtons}>
              <Button
                type="button"
                variant="outlined"
                color="default"
                style={{ color: '#fff' }}
                size="large"
                href="/login"
              >
                Login
              </Button>

              <Button
                type="button"
                variant="contained"
                color="primary"
                size="large"
                href="/register"
              >
                Sign up now
              </Button>
            </Box>
          </Box>
        </Box>

        <Paper elevation={4} className={classes.features} align="center">
          <Typography variant="h3">Features</Typography>

          <Typography variant="body1">
            Stuff will go here eventually...
          </Typography>

          <Paper
            align="left"
            className={`${classes.paper} ${classes.changelog}`}
          >
            <ReactMarkdown source={changelog} />
          </Paper>
        </Paper>

        <Box className={classes.about} align="center">
          <Typography variant="h4">Who made this?</Typography>

          <Typography variant="body1" style={{ marginTop: '16px' }}>
            Hi, I'm Joe and I'm the creator and developer of CosManage. I make
            websites for fun (you can check out my{' '}
            <Link
              href="https://github.com/L-Dragon5/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            ). A lot of my friends are very active cosplayers and I built this
            website as a collection of tools for them to use to organize their
            plans.
          </Typography>

          <Typography variant="body1" style={{ marginTop: '16px' }}>
            Feel free to contact me if you have any problems or any things you
            wanted added in the future. I hope to grow this as much as possible!
          </Typography>

          <Button
            type="button"
            variant="outlined"
            color="link"
            size="large"
            style={{ marginTop: '32px' }}
            href="mailto:help@cosmanage.com"
          >
            help@cosmanage.com
          </Button>
        </Box>
      </Grid>

      <Box className={classes.footer}>
        <Copyright style={{ color: '#fff' }} />
      </Box>
    </>
  );
};

export default HomePage;
