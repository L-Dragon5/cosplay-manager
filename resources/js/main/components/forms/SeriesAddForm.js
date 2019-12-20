import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import M from 'materialize-css'
import Cropper from 'react-cropper'

const cropper = React.createRef(null)

class SeriesAddForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      image: null,
      saveImage: null
    }

    this.token = props.token

    this.handleSubmit = this.handleSubmit.bind(this)
    this._cropImage = this._cropImage.bind(this)
    this._getBase64 = this._getBase64.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    $('.modal-errors').html('').hide()
    $('#modal-loader').show()
    $('#modal-submit').hide()

    const formData = new FormData(e.target)

    if (this.state.saveImage !== null) {
      formData.set('image', this.state.saveImage)
    }

    axios.post('/api/series/create', formData, {
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
        let html = ''

        if (Array.isArray(error.response)) {
          for (const [key, value] of Object.entries(error.response.data.message)) {
            html += key + ': ' + value + '<br>'
          }
        } else {
          html += error.response.data.message
        }

        $('.modal-errors').html(html).show()
      }
    }).then(() => {
      $('#modal-loader').hide()
      $('#modal-submit').show()
    })
  }

  _cropImage () {
    this.setState({
      saveImage: cropper.current.getCroppedCanvas().toDataURL()
    })
  }

  _getBase64 (e) {
    const node = e.currentTarget

    if (node.files !== null && node.files.length > 0) {
      const image = node.files[0]
      const reader = new FileReader()

      reader.addEventListener('load', (e) => {
        this.setState({
          image: e.target.result
        })
      }, false)

      if (image) {
        reader.readAsDataURL(image)
      }
    }
  }

  render () {
    return (
      <div className='row'>
        <form className='col s12' onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='modal-errors col s12' />

            <div className='input-field col s12'>
              <input id='title' type='text' name='title' className='validate' required />
              <label htmlFor='title'>Title *</label>
            </div>

            <div className='col s12'>
              <div className='file-field input-field'>
                <div className='btn'>
                  <span>Image</span>
                  <input id='image' type='file' name='image' accept='image/*' onChange={(e) => this._getBase64(e)} />
                </div>
                <div className='file-path-wrapper'>
                  <input className='file-path validate' type='text' name='image_text' />
                </div>
              </div>
            </div>

            { this.state.image &&
            <div className='col s12' style={{ marginBottom: '1rem' }}>
              <Cropper
                ref={cropper}
                viewMode={1}
                src={this.state.image}
                style={{ maxHeight: 350 }}
                guides={false}
                crop={this._cropImage}
              />
            </div>
            }

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

export default SeriesAddForm
