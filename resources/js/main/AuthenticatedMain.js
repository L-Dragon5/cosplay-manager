import React, { useEffect } from 'react';
import axios from 'axios';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange, pink } from '@material-ui/core/colors';

// Components
import Navbar from './components/include/Navbar';
import Helper from './components/Helper';

// Pages
// import AllCosplaysPage from './components/pages/AllCosplaysPage';

import Dashboard from './components/pages/Dashboard';
import SeriesGrid from './components/pages/CosplayGrid/SeriesGrid';
// import CharacterGrid from './components/pages/CosplayGrid/CharacterGrid';
// import OutfitGrid from './components/pages/CosplayGrid/OutfitGrid';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: pink,
  },
});

const AuthenticatedMain = () => {
  useEffect(() => {
    if (Helper.checkLocalStorage()) {
      const token = Helper.getToken();

      const formData = new FormData();
      formData.set('token', token);

      // Check Logged in State
      axios
        .post('/api/checkUser', formData, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data',
          },
        })
        .catch((error) => {
          if (error.response) {
            window.location.replace(error.response.data.message);
          }
        });
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="dashboard">
        <Navbar />
        <div>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/cosplay-management" component={SeriesGrid} />
          </Switch>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

/**
 * <Route exact path="/s-:series" component={CharacterGrid} />
              <Route
                exact
                path="/s-:series/c-:character"
                component={OutfitGrid}
              />
              <Route path="/all-cosplays" component={AllCosplaysPage} />
 */

export default AuthenticatedMain;
