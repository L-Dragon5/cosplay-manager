import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

// Include
import Navbar from './components/include/Navbar';

// Components
import Helper from './components/Helper';

// Pages
import AllCosplaysPage from './components/pages/AllCosplaysPage';

import SeriesGrid from './components/pages/CosplayGrid/SeriesGrid';
import CharacterGrid from './components/pages/CosplayGrid/CharacterGrid';
import OutfitGrid from './components/pages/CosplayGrid/OutfitGrid';

class AuthenticatedMain extends Component {
  componentDidMount() {
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
  }

  render() {
    return (
      <>
        <CssBaseline />
        <BrowserRouter basename={`${process.env.PUBLIC_URL}/organizer`}>
          <div>
            <Navbar />
            <Switch>
              <Route exact path="/" component={SeriesGrid} />
              <Route exact path="/s-:series" component={CharacterGrid} />
              <Route
                exact
                path="/s-:series/c-:character"
                component={OutfitGrid}
              />

              <Route path="/all-cosplays" component={AllCosplaysPage} />
            </Switch>
          </div>
        </BrowserRouter>
      </>
    );
  }
}

export default AuthenticatedMain;
