import React, { useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import {
  AppBar,
  Box,
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
      cursor: 'pointer',
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
  const [
    cosplayManagementMenuStatus,
    setCosplayManagementMenuStatus,
  ] = useState(false);
  const [accountSettingsMenuStatus, setAccountSettingsMenuStatus] = useState(
    false,
  );

  const [drawerStatus, setDrawerStatus] = useState(false);

  const openCosplayManagementMenu = (e) => {
    e.preventDefault();

    setAnchorEl(e.currentTarget);
    setCosplayManagementMenuStatus(true);
  };

  const closeCosplayManagementMenu = () => {
    setCosplayManagementMenuStatus(false);
  };

  const openAccountSettingsMenu = (e) => {
    setAnchorEl(e.currentTarget);
    setAccountSettingsMenuStatus(true);
  };

  const closeAccountSettingsMenu = () => {
    setAccountSettingsMenuStatus(false);
  };

  const drawerOpen = () => {
    setDrawerStatus(true);
  };

  const drawerClose = () => {
    setDrawerStatus(false);
  };

  return (
    <div className={classes.root}>
      <Hidden mdUp>
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
      </Hidden>

      <AppBar position="static">
        <Toolbar>
          <Hidden mdUp>
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
            <Hidden smDown>
              <NavLink to="/">Dashboard</NavLink>

              <NavLink
                aria-controls="menu-cosplay-management"
                to="/cosplay-management"
                activeClassName="active-tool"
                onClick={openCosplayManagementMenu}
              >
                Cosplay Management
              </NavLink>
              <Menu
                id="menu-cosplay-management"
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
                open={cosplayManagementMenuStatus}
                onClose={closeCosplayManagementMenu}
              >
                <MenuItem
                  component={NavLink}
                  to="/cosplay-management"
                  activeClassName="active-tool"
                  onClick={closeCosplayManagementMenu}
                >
                  Series Grid
                </MenuItem>
                <MenuItem
                  component={NavLink}
                  to="/cosplay-management/all-cosplays"
                  activeClassName="active-tool"
                  onClick={closeCosplayManagementMenu}
                >
                  All Cosplays
                </MenuItem>
              </Menu>

              <NavLink to="/taobao-organizer" activeClassName="active-tool">
                Taobao Organizer
              </NavLink>

              <Box component="a">Tag Manager</Box>

              <IconButton
                aria-label="account of current user"
                aria-controls="menu-account-settings"
                aria-haspopup="true"
                onClick={openAccountSettingsMenu}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-account-settings"
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
                open={accountSettingsMenuStatus}
                onClose={closeAccountSettingsMenu}
              >
                <MenuItem onClick={closeAccountSettingsMenu}>
                  My Account (In Progress)
                </MenuItem>
                <MenuItem onClick={closeAccountSettingsMenu}>
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
