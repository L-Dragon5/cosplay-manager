import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import M from 'materialize-css'

class SeriesEditForm extends Component {
  constructor (props) {
    super(props)

    this.token = props.token
    this.id = props.id
    this.title = props.title

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    $('#modal-errors-' + this.id).html('').hide()
    $('#modal-loader-' + this.id).show()
    $('#modal-submit-' + this.id).hide()

    const formData = new FormData(e.target)

    axios.post('/api/series/update/' + this.id, formData, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token,
        'content-type': 'multipart/form-data'
      }
    }).then((response) => {
      if (response.status === 200) {
        M.toast({ html: response.data.message })
        $('#modal-close-' + this.id).trigger('click')
        this.props.unmount(JSON.stringify(response.data.series))
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
  }

  render () {
    return (
      <div className='row'>
        <form className='col s12' onSubmit={this.handleSubmit}>
          <div className='row'>
            <div id={'modal-errors-' + this.id} className='modal-errors col s12' />

            <div className='input-field col s12'>
              <input id={'title-' + this.id} type='text' name='title' className='validate' defaultValue={this.title} required />
              <label htmlFor={'title-' + this.id}>Title *</label>
            </div>

            <div className='col s12'>
              <div className='input-field col'>
                <div className='file-field input-field'>
                  <div className='btn'>
                    <span>Image</span>
                    <input id={'image-' + this.id} type='file' name='image' accept='image/*' />
                  </div>
                  <div className='file-path-wrapper'>
                    <input className='file-path validate' type='text' name='image_text' />
                    <span className='helper-text'>Leave blank to keep image the same.</span>
                  </div>
                </div>
              </div>

              <div className='input-field col'>
                <input id={'image-url-' + this.id} type='url' name='image_url' />
                <label htmlFor={'image-url-' + this.id}>Image URL</label>
                <span className='helper-text'>Leave blank to keep image the same.</span>
              </div>
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

export default SeriesEditForm
