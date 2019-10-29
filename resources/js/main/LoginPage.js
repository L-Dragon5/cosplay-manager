import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

// Components
import Helper from './components/Helper'

class LoginPage extends Component {
  render () {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Login Page</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginPage

if ($('#login-root').length) {
  ReactDOM.render(<LoginPage />, document.getElementById('login-root'))
}
