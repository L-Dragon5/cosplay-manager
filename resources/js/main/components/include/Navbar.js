import React, { useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import {
  AppBar,
  Hidden,
  SwipeableDrawer,
  List,
  ListItem,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    '& > a': {
      color: 'rgba(0, 0, 0, 0.87)',
      textDecoration: 'none',
    },
  },
  nav: {
    '& > a': {
      color: 'rgba(0, 0, 0, 0.87)',
      textDecoration: 'none',
      padding: '12px',
      fontSize: '1rem',
    },
    '& > a.active-tool': {
      borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
    },
    '& > a:hover': {
      borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerStatus, setDrawerStatus] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawerOpen = () => {
    setDrawerStatus(true);
  };

  const drawerClose = () => {
    setDrawerStatus(false);
  };

  return (
    <div className={classes.root}>
      <SwipeableDrawer
        anchor="left"
        open={drawerStatus}
        onClose={drawerClose}
        onOpen={drawerOpen}
      >
        <List>
          <ListItem>
            <NavLink to="/" onClick={drawerClose}>
              Dashboard
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink
              to="/cosplay-management"
              activeClassName="active-tool"
              onClick={drawerClose}
            >
              Cosplay Management
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink
              to="/taobao-organizer"
              activeClassName="active-tool"
              onClick={drawerClose}
            >
              Taobao Organizer
            </NavLink>
          </ListItem>
        </List>
      </SwipeableDrawer>

      <AppBar position="static">
        <Toolbar>
          <Hidden smUp>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={drawerOpen}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>

          <Typography variant="h6" className={classes.title}>
            <NavLink to="/">CosManage</NavLink>
          </Typography>
          <nav className={classes.nav}>
            <Hidden only="xs">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/cosplay-management" activeClassName="active-tool">
                Cosplay Management
              </NavLink>
              <NavLink to="/taobao-organizer" activeClassName="active-tool">
                Taobao Organizer
              </NavLink>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  My Account (In Progress)
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  Changelog (In Progress)
                </MenuItem>
              </Menu>
            </Hidden>
          </nav>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(Navbar);
