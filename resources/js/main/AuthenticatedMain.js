import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import $ from 'jquery'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

// Include
import Navbar from './components/include/Navbar'

// Components
import Helper from './components/Helper'

// Pages
import CosplayGridPage from './components/pages/CosplayGridPage'
import AllCosplaysPage from './components/pages/AllCosplaysPage'

class AuthenticatedMain extends Component {
  componentDidMount () {
    if (Helper.checkLocalStorage()) {
      const token = Helper.getToken()

      const formData = new FormData()
      formData.set('token', token)

      // Check Logged in State
      axios.post('/api/checkUser', formData, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
          'content-type': 'multipart/form-data'
        }
      }).catch(error => {
        if (error.response) {
          window.location.replace(error.response.data.message)
        }
      })
    }
  }

  render () {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Switch>
            <Route exact path='/' component={CosplayGridPage} />
            <Route path='/all-cosplays' component={AllCosplaysPage} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default AuthenticatedMain

if ($('#authenticated-root').length) {
  ReactDOM.render(<AuthenticatedMain />, document.getElementById('authenticated-root'))
}
