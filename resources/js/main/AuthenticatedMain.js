import React, { useEffect } from 'react';
import axios from 'axios';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange, pink } from '@material-ui/core/colors';

// Components
import Navbar from './components/include/Navbar';
import Helper from './components/Helper';

// Root Page
import Dashboard from './components/pages/Dashboard';

// Cosplay Management Pages
import AllCosplaysPage from './components/pages/CosplayManagement/AllCosplaysPage';
import SeriesGrid from './components/pages/CosplayManagement/SeriesGrid';
import CharacterGrid from './components/pages/CosplayManagement/CharacterGrid';
import OutfitGrid from './components/pages/CosplayManagement/OutfitGrid';

// Taobao Organizer Pages
import TaobaoItems from './components/pages/TaobaoOrganizer/TaobaoItems';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: pink,
  },
});

const AuthenticatedMain = () => {
  const routes = [
    {
      path: '/',
      component: Dashboard,
    },
    {
      path: '/cosplay-management',
      component: SeriesGrid,
    },
    {
      path: '/cosplay-management/all-cosplays',
      component: AllCosplaysPage,
    },
    {
      path: '/cosplay-management/s-:series',
      component: CharacterGrid,
    },
    {
      path: '/cosplay-management/s-:series/c-:character',
      component: OutfitGrid,
    },
    {
      path: '/taobao-organizer',
      component: TaobaoItems,
    },
  ];

  const routeComponents = routes.map(({ path, component }, key) => (
    <Route exact path={path} component={component} key={key} />
  ));

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
          <Switch>{routeComponents}</Switch>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default AuthenticatedMain;
