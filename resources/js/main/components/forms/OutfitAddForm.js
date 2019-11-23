import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import M from 'materialize-css'

class OutfitAddForm extends Component {
  constructor (props) {
    super(props)

    this.token = props.token
    this.characterID = props.characterID

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    $('.modal-errors').html('').hide()
    $('#modal-loader').show()
    $('#modal-submit').hide()

    const formData = new FormData(e.target)
    formData.set('character_id', this.characterID)

    axios.post('/api/outfit/create', formData, {
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

  componentDidMount () {
    M.FormSelect.init($('select'))
  }

  render () {
    return (
      <div className='row'>
        <form className='col s12' onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='modal-errors col s12' />

            <div className='input-field col s12 m6'>
              <input id='title' type='text' name='title' className='validate' required />
              <label htmlFor='title'>Outfit Title *</label>
            </div>

            <div className='input-field col s12 m6'>
              <select name='status' defaultValue='0'>
                <option value='0'>Future Cosplay</option>
                <option value='1'>Owned & Unworn</option>
                <option value='2'>Worn</option>
              </select>
              <label>Outfit Status *</label>
            </div>

            <div className='input-field col s12'>
              <div className='file-field input-field'>
                <div className='btn'>
                  <span>Images</span>
                  <input id='images' type='file' name='images[]' accept='image/*' multiple />
                </div>
                <div className='file-path-wrapper'>
                  <input className='file-path validate' type='text' name='image_text' placeholder='Upload one or more files' />
                </div>
              </div>
            </div>

            <div className='input-field col s12 m4'>
              <input id='bought_date' type='date' name='bought_date' className='validate' />
              <label htmlFor='bought_date'>Bought Date</label>
            </div>

            <div className='input-field col s12 m4'>
              <input id='storage_location' type='text' name='storage_location' className='validate' />
              <label htmlFor='storage_location'>Storage Location</label>
            </div>

            <div className='input-field col s12 m4'>
              <textarea id='times_worn' className='materialize-textarea' name='times_worn' />
              <label htmlFor='times_worn'>Times Worn</label>
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

export default OutfitAddForm
