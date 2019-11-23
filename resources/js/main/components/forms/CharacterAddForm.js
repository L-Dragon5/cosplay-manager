import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import M from 'materialize-css'

class CharacterAddForm extends Component {
  constructor (props) {
    super(props)

    this.token = props.token
    this.seriesID = props.seriesID

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    $('.modal-errors').html('').hide()
    $('#modal-loader').show()
    $('#modal-submit').hide()

    const formData = new FormData(e.target)
    formData.set('series_id', this.seriesID)

    axios.post('/api/character/create', formData, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token,
        'content-type': 'multipart/form-data'
      }
    }).then((response) => {
      if (response.status === 200) {
        M.toast({ html: response.data.message })
        $('#modal-close').trigger('click')
        this.props.unmount()
      }
    }).catch((error) => {
      if (error.response) {
        var html = ''
        for (const [key, value] of Object.entries(error.response.data.message)) {
          html += key + ': ' + value + '<br>'
        }
        $('.modal-errors').html(html).show()
      }
    }).then(() => {
      $('#modal-loader').hide()
      $('#modal-submit').show()
    })
  }

  render () {
    return (
      <div className='row'>
        <form className='col s12' onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='modal-errors col s12' />

            <div className='input-field col s12'>
              <input id='name' type='text' name='name' className='validate' required />
              <label htmlFor='name'>Name</label>
            </div>

            <div className='input-field col s12'>
              <div className='file-field input-field'>
                <div className='btn'>
                  <span>Image</span>
                  <input id='image' type='file' name='image' accept='image/*' />
                </div>
                <div className='file-path-wrapper'>
                  <input className='file-path validate' type='text' name='image_text' />
                </div>
              </div>
            </div>

            <div className='right-align'>
              <button id='modal-submit' type='submit' className='waves-effect waves-green btn'>Add</button>
              <div id='modal-loader' style={{ display: 'none' }} className='preloader-wrapper small active'><div className='spinner-layer spinner-green-only'><div className='circle-clipper left'><div className='circle' /></div><div className='gap-patch'><div className='circle' /></div><div className='circle-clipper right'><div className='circle' /></div></div></div>
              <button id='modal-close' type='button' className='modal-close' style={{ display: 'none' }} />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default CharacterAddForm
