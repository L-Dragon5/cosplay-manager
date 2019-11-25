import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import $ from 'jquery'

// Components
import Helper from './components/Helper'

class RegisterPage extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  passToken (data) {
    if (Helper.setToken(data)) {
      window.location.href = '/'
    } else {
      alert('Your browser doesn\'t support the login storage option. Please use an updated browser.')
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    $('.form-errors').html('').hide()
    $('#form-loader').show()
    $('#form-submit').hide()

    const formData = new FormData(e.target)

    axios.post('/api/register', formData, {
      header: {
        Accept: 'application/json',
        'content-type': 'multipart/form-data'
      }
    }).then((response) => {
      if (response.status === 200) {
        this.passToken(response.data.message)
      }
    }).catch((error) => {
      if (error.response) {
        var html = ''
        for (const [key, value] of Object.entries(error.response.data.message)) {
          html += key + ': ' + value + '<br>'
        }
        $('.form-errors').html(html).show()
      }
    }).then(() => {
      $('#form-loader').hide()
      $('#form-submit').show()
    })
  }

  render () {
    return (
      <div className='container center-align' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className='row'>
          <div className='col s12'>
            <div className='row'>
              <div className='col s12'>
                <h4>CosManage Registration</h4>
                <p>Register an account to gain access.</p>
              </div>
            </div>

            <div className='row'>
              <div className='col s8 offset-s2' style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.125)', borderRadius: '0.25rem' }}>
                <div className='row' style={{ marginTop: '20px', marginBottom: '0' }}>
                  <div className='form-errors col s12' />

                  <form className='col s12' onSubmit={this.handleSubmit}>
                    <div className='row' style={{ marginBottom: '0' }}>
                      <div className='input-field col s12'>
                        <input id='email' name='email' type='email' required />
                        <label htmlFor='email'>E-Mail</label>
                      </div>
                    </div>

                    <div className='row' style={{ marginBottom: '0' }}>
                      <div className='input-field col s12'>
                        <input id='password' name='password' type='password' required />
                        <label htmlFor='password'>Password</label>
                      </div>
                    </div>

                    <div className='row' style={{ marginBottom: '0' }}>
                      <div className='input-field col s12'>
                        <input id='c_password' name='c_password' type='password' required />
                        <label htmlFor='c_password'>Confirm Password</label>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='g-recaptcha'
                        name='g-recaptcha-response'
                        data-sitekey={process.env.MIX_GOOGLE_RECAPTCHA_KEY}
                        style={{ marginLeft: '16px' }} />
                    </div>

                    <div className='row left-align'>
                      <button id='form-submit' className='btn waves-effect waves-light' style={{ margin: '0 16px' }} type='submit' name='action'>Register</button>
                      <div id='form-loader' style={{ display: 'none' }} className='preloader-wrapper small active'><div className='spinner-layer spinner-green-only'><div className='circle-clipper left'><div className='circle'></div></div><div className='gap-patch'><div className='circle'></div></div><div className='circle-clipper right'><div className='circle'></div></div></div></div>
                    </div>
                  </form>

                </div>
              </div>
            </div>

            <div className='row left-align'>
              <div className='col s8 offset-s2'>
                <a href='/auth/login'>Have an account? Login here.</a>
              </div>
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
