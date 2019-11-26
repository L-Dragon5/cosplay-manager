import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import M from 'materialize-css'

import CreatableSelect from 'react-select/creatable'

class OutfitEditForm extends Component {
  constructor (props) {
    super(props)

    this.token = props.token
    this.id = props.id
    this.title = props.title
    this.status = props.status
    this.obtained_on = props.obtained_on
    this.creator = props.creator
    this.storage_location = props.storage_location
    this.times_worn = props.times_worn
    this.options = props.options
    this.tags = props.tags

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    $('#modal-errors-' + this.id).html('').hide()
    $('#modal-loader-' + this.id).show()
    $('#modal-submit-' + this.id).hide()

    const formData = new FormData(e.target)

    axios.post('/api/outfit/update/' + this.id, formData, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token,
        'content-type': 'multipart/form-data'
      }
    }).then((response) => {
      if (response.status === 200) {
        M.toast({ html: response.data.message })
        $('#modal-close-' + this.id).trigger('click')
        this.props.unmount(JSON.stringify(response.data.outfit))
      }
    }).catch((error) => {
      if (error.response) {
        let html = ''

        if (Array.isArray(error.response)) {
          for (const [key, value] of Object.entries(error.response.data.message)) {
            html += key + ': ' + value + '<br>'
          }
        } else {
          html += error.response.data.message
        }

        $('#modal-errors-' + this.id).html(html).show()
      }
    }).then(() => {
      $('#modal-loader-' + this.id).hide()
      $('#modal-submit-' + this.id).show()
    })
  }

  componentDidMount () {
    M.updateTextFields()
    M.FormSelect.init($('select'))
    M.Datepicker.init($('.datepicker'), {
      format: 'yyyy-mm-dd'
    })
  }

  render () {
    return (
      <div className='row'>
        <form className='col s12' onSubmit={this.handleSubmit}>
          <div className='row'>
            <div id={'modal-errors-' + this.id} className='modal-errors col s12' />

            <div className='input-field col s12 m6'>
              <input id={'title-' + this.id} type='text' name='title' className='validate' defaultValue={this.title} required />
              <label htmlFor={'title-' + this.id}>Outfit Title *</label>
            </div>

            <div className='input-field col s12 m6'>
              <select name='status' defaultValue={this.status}>
                <option value='0'>Future Cosplay</option>
                <option value='1'>Owned & Unworn</option>
                <option value='2'>Worn</option>
              </select>
              <label>Outfit Status *</label>
            </div>

            <div className='col s12'>
              <div className='input-field col'>
                <div className='file-field input-field'>
                  <div className='btn'>
                    <span>Images</span>
                    <input id={'images-' + this.id} type='file' name='images[]' accept='image/*' multiple />
                  </div>
                  <div className='file-path-wrapper'>
                    <input className='file-path validate' type='text' name='image_text' placeholder='Upload one or more files' />
                  </div>
                </div>
              </div>

              <div className='input-field col'>
                <input id={'image-url-' + this.id} type='url' name='image_url' />
                <label htmlFor={'image-url-' + this.id}>Image URL</label>
              </div>
            </div>

            <div className='input-field col s12 m4'>
              <input id={'obtained-on-' + this.id} type='text' name='obtained_on' className='datepicker validate' defaultValue={this.obtained_on} />
              <label htmlFor={'obtained-on-' + this.id}>Obtained On</label>
            </div>

            <div className='input-field col s12 m4'>
              <input id={'creator-' + this.id} type='text' name='creator' className='validate' defaultValue={this.creator} />
              <label htmlFor={'creator-' + this.id}>Creator</label>
            </div>

            <div className='input-field col s12 m4'>
              <input id={'storage-location-' + this.id} type='text' name='storage_location' className='validate' defaultValue={this.storage_location} />
              <label htmlFor={'storage-location-' + this.id}>Storage Location</label>
            </div>

            <div className='input-field col s12 m6'>
              <CreatableSelect
                id={'tag-select-' + this.id}
                isMulti
                isClearable={false}
                name='tags[]'
                closeMenuOnSelect={false}
                placeholder='Select tags'
                options={this.options}
                defaultValue={this.tags}
              />
            </div>

            <div className='input-field col s12 m6'>
              <textarea id={'times-worn-' + this.id} className='materialize-textarea' name='times_worn' defaultValue={this.times_worn} />
              <label htmlFor={'times-worn-' + this.id}>Times Worn</label>
            </div>

            <div className='right-align'>
              <button id={'modal-submit-' + this.id} type='submit' className='waves-effect waves-green btn'>Save</button>
              <div id={'modal-loader-' + this.id} style={{ display: 'none' }} className='preloader-wrapper small active'><div className='spinner-layer spinner-green-only'><div className='circle-clipper left'><div className='circle' /></div><div className='gap-patch'><div className='circle' /></div><div className='circle-clipper right'><div className='circle' /></div></div></div>
              <button id={'modal-close-' + this.id} type='button' className='modal-close' style={{ display: 'none' }} />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default OutfitEditForm
