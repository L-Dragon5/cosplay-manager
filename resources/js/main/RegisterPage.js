import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

// Components
import Helper from './components/Helper'

class RegisterPage extends Component {
  render () {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Register Page</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RegisterPage

if ($('#register-root').length) {
  ReactDOM.render(<RegisterPage />, document.getElementById('register-root'))
}
