import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Carousel from 'react-material-ui-carousel';

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
    minHeight: '100vh',
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
    maxHeight: '400px',
    overflowY: 'auto',
    padding: theme.spacing(2),
    paddingTop: '0',
    color: theme.palette.text.primary,
  },
  carousel: {
    maxWidth: '1200px',
    margin: '32px 0',
    '& img': {
      width: '100%',
    },
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

          <Grid container spacing={2} style={{ margin: '32px 0' }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Cosplay Management</Typography>
              <Typography variant="body1">
                Organize your cosplay plans and ones currently owned in one easy
                place. Easy to look through and organize with images and
                customized text fields.
              </Typography>
              <Typography variant="body2" style={{ marginTop: '16px' }}>
                The colors match up to the status of the outfit in the plan.
              </Typography>
              <Typography variant="body2">
                (Future = Green, Owned & Unworn = Blue, Worn = Red)
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Taobao Organizer</Typography>
              <Typography variant="body1">
                If you buy a lot of your cosplays on Taobao and have a
                never-ending folder of bookmarks on your browser, this is the
                right tool for you. Just paste in the taobao link of your choice
                and it will grab the necessary information of the item and
                display in it a grid format for easy viewing and access.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Tag Manager</Typography>
              <Typography variant="body1">
                An added bonus for more management, there is a tag management
                system that can be applied to all Outfits in the Cosplay
                Management tool and all Items in the Taobao Organizer tool and
                can be searched for on the corresponding pages. This will make
                it easier to have custom names that aren't available straight
                out of the box.
              </Typography>
            </Grid>
          </Grid>

          <Carousel className={classes.carousel}>
            <img
              src="/storage/homepage-carousel/features-1.png"
              alt="Cosplay management series page"
              draggable={false}
            />
            <img
              src="/storage/homepage-carousel/features-2.png"
              alt="Cosplay management editing series"
              draggable={false}
            />
            <img
              src="/storage/homepage-carousel/features-3.png"
              alt="Cosplay management series page"
              draggable={false}
            />
            <img
              src="/storage/homepage-carousel/features-4.png"
              alt="Cosplay management adding new character"
              draggable={false}
            />
            <img
              src="/storage/homepage-carousel/features-5.png"
              alt="Cosplay managmenet adding new outfit"
              draggable={false}
            />
            <img
              src="/storage/homepage-carousel/features-6.png"
              alt="Cosplay management all outfits grid"
              draggable={false}
            />
            <img
              src="/storage/homepage-carousel/features-7.png"
              alt="Taobao organizer all item"
              draggable={false}
            />
            <img
              src="/storage/homepage-carousel/features-8.png"
              alt="Tag manager"
              draggable={false}
            />
          </Carousel>

          <Paper
            align="left"
            elevation={6}
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
            ). My girlfriend and a lot of my friends are very active cosplayers,
            so I built this website as a collection of tools for them to use to
            organize their plans.
          </Typography>

          <Typography variant="body1" style={{ marginTop: '16px' }}>
            Feel free to contact me if you have any problems or any things you
            wanted added in the future. I hope to grow this as much as possible!
          </Typography>

          <Button
            type="button"
            variant="outlined"
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
