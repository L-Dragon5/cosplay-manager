import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'
import { Route, NavLink, Router } from 'react-router-dom'

class AuthenticatedMain extends Component {
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
