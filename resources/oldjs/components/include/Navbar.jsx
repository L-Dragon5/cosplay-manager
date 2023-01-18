import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, withRouter, useHistory } from 'react-router-dom';
import FileDownload from 'js-file-download';

import {
  AppBar,
  Box,
  Modal,
  Hidden,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';

import Helper from '../Helper';
import PasswordEditForm from './PasswordEditForm';

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

const Navbar = () => {
  const history = useHistory();
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

  const [renderForm, setRenderForm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const token = Helper.getToken();

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

  const mobileNavClick = (url) => {
    drawerClose();
    history.push(url);
  };

  const handleFormSendSuccess = (data) => {
    setSuccessAlertMessage(data);
    setSnackbarStatus(true);
    setModalStatus(false);
    setRenderForm(false);
  };

  const handleFormSendError = (data) => {
    setErrorAlertMessage(data);
    setSnackbarStatus(true);
  };

  const modalOpen = () => {
    closeAccountSettingsMenu();
    setRenderForm(true);
    setModalStatus(true);
  };

  const modalClose = () => {
    setModalStatus(false);
  };

  const snackbarClose = () => {
    setSnackbarStatus(false);
    setSuccessAlertMessage('');
    setErrorAlertMessage('');
  };

  const downloadTBOCSV = () => {
    closeAccountSettingsMenu();
    axios
      .get(`/api/account/getCSV`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        FileDownload(response.data, 'tborganizer-export.csv');
        setSuccessAlertMessage('File downloading...');
        setSnackbarStatus(true);
      })
      .catch((error) => {
        if (error.response) {
          let message = '';

          if (Array.isArray(error.response)) {
            Object.keys(error.response.data.message).forEach((key) => {
              message += `[${key}] - ${error.response.data.message[key]}\r\n`;
            });
          } else {
            message += error.response.data.message;
          }

          setErrorAlertMessage(message);
          setSnackbarStatus(true);
        }
      });
  };

  return (
    <Box className={classes.root}>
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

      {successAlertMessage && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={snackbarStatus}
          onClose={snackbarClose}
          autoHideDuration={2000}
        >
          <Alert severity="success">{successAlertMessage}</Alert>
        </Snackbar>
      )}

      <Hidden mdUp>
        <SwipeableDrawer
          anchor="left"
          open={drawerStatus}
          onClose={drawerClose}
          onOpen={drawerOpen}
        >
          <List
            component="nav"
            aria-labelledby="main-options-mobile-header"
            subheader={
              <ListSubheader component="div" id="main-options-mobile-header">
                Main Options
              </ListSubheader>
            }
          >
            <ListItem button onClick={() => mobileNavClick('/')}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => mobileNavClick('/tag-manager')}>
              <ListItemText primary="Tag Manager" />
            </ListItem>
          </List>
          <List
            component="nav"
            aria-labelledby="cosplay-management-mobile-header"
            subheader={
              <ListSubheader
                component="div"
                id="cosplay-management-mobile-header"
              >
                Cosplay Management
              </ListSubheader>
            }
          >
            <ListItem
              button
              onClick={() => mobileNavClick('/cosplay-management')}
            >
              <ListItemText primary="Series Grid" />
            </ListItem>
            <ListItem
              button
              onClick={() => mobileNavClick('/cosplay-management/all-cosplays')}
            >
              <ListItemText primary="All Cosplays" />
            </ListItem>
          </List>
          <List
            component="nav"
            aria-labelledby="taobao-organizer-mobile-header"
            subheader={
              <ListSubheader
                component="div"
                id="taobao-organizer-mobile-header"
              >
                Taobao Organizer
              </ListSubheader>
            }
          >
            <ListItem
              button
              onClick={() => mobileNavClick('/taobao-organizer')}
            >
              <ListItemText primary="All Items" />
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

              <NavLink to="/tag-manager" activeClassName="active-tool">
                Tag Manager
              </NavLink>

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
                <MenuItem onClick={downloadTBOCSV}>
                  Download Taobao Organizer CSV
                </MenuItem>
                <MenuItem onClick={modalOpen}>Change Password</MenuItem>
              </Menu>
            </Hidden>
          </nav>
        </Toolbar>
      </AppBar>

      {renderForm ? (
        <Modal
          open={modalStatus}
          onClose={modalClose}
          disableEnforceFocus
          disableAutoFocus
        >
          <Box className={classes.paper}>
            <PasswordEditForm
              token={token}
              sendSuccess={handleFormSendSuccess}
              sendError={handleFormSendError}
            />
          </Box>
        </Modal>
      ) : null}
    </Box>
  );
};

export default withRouter(Navbar);
