import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'
import { Redirect, Route, NavLink, Router } from 'react-router-dom'

// Components
import Helper from './components/Helper'

class AuthenticatedMain extends Component {
  componentDidMount () {
    if (Helper.checkLocalStorage()) {
      const token = (localStorage.getItem('token') !== null) ? localStorage.getItem('token') : null

      const formData = new FormData()
      formData.set('token', token)

      // Check Logged in State
      axios.get('/api/checkUser', formData, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer' + token,
          'content-type': 'multipart/form-data'
        }
      }).then(response => {
        console.log(response)
      }).catch(error => {
        if (error.response) {
          window.location.replace(error.response.data.message)
        }
      })
    }
  }

  render () {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Example Component</div>

              <div className="card-body">I'm an example component!</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AuthenticatedMain

if ($('#authenticated-root').length) {
  ReactDOM.render(<AuthenticatedMain />, document.getElementById('authenticated-root'))
}
