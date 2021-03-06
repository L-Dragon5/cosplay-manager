import React, { useEffect, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  gridLink: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  changelog: {
    maxHeight: '600px',
    overflowY: 'auto',
    paddingTop: '0',
  },
}));

const Dashboard = () => {
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
    <div className={classes.root}>
      <Typography variant="h4" align="center" style={{ marginBottom: '16px' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <NavLink to="/cosplay-management" className={classes.gridLink}>
            <Paper className={classes.paper}>
              <Typography variant="h5">Cosplay Management</Typography>
              <Typography variant="body1">
                Manage cosplays by series, characters, and outfits. Helpful for
                organizing owned and planned cosplays.
              </Typography>
            </Paper>
          </NavLink>
        </Grid>
        <Grid item xs={12} md={6}>
          <NavLink to="taobao-organizer" className={classes.gridLink}>
            <Paper className={classes.paper}>
              <Typography variant="h5">Taobao Organizer</Typography>
              <Typography variant="body1">
                Manage added taobao listings with tags and notes. Helpful for
                organizing buy lists for Taobao.
              </Typography>
            </Paper>
          </NavLink>
        </Grid>
        <Grid item xs={12} md={6}>
          <NavLink to="tag-manager" className={classes.gridLink}>
            <Paper className={classes.paper}>
              <Typography variant="h5">Tag Manager</Typography>
              <Typography variant="body1">
                Manage tags used for organizing and sorting through outfits in
                Cosplay Management and items in Taobao Organizer.
              </Typography>
            </Paper>
          </NavLink>
        </Grid>
        <Grid item xs={12}>
          <Paper className={`${classes.paper} ${classes.changelog}`}>
            <ReactMarkdown source={changelog} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(Dashboard);
