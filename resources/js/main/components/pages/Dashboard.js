import React, { useEffect } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  gridLink: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  useEffect(() => {
    document.title = 'Dashboard | CosManage';
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
      </Grid>
    </div>
  );
};

export default withRouter(Dashboard);
