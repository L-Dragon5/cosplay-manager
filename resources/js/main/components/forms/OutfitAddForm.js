import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import M from 'materialize-css'
import Cropper from 'react-cropper'

import CreatableSelect from 'react-select/creatable'
import makeAnimated from 'react-select/animated'
const animatedComponents = makeAnimated()

const cropper = React.createRef(null)

class OutfitAddForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      image: null,
      saveImage: null
    }

    this.token = props.token
    this.characterID = props.characterID
    this.options = props.options

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
    formData.set('character_id', this.characterID)

    if (this.state.saveImage !== null) {
      formData.set('image', this.state.saveImage)
    }

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

  componentDidMount () {
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

            <div className='input-field col s12 m4'>
              <input id='obtained_on' type='text' name='obtained_on' className='datepicker validate' />
              <label htmlFor='obtained_on'>Obtained On</label>
            </div>

            <div className='input-field col s12 m4'>
              <input id='creator' type='text' name='creator' className='validate' />
              <label htmlFor='creator'>Creator</label>
            </div>

            <div className='input-field col s12 m4'>
              <input id='storage_location' type='text' name='storage_location' className='validate' />
              <label htmlFor='storage_location'>Storage Location</label>
            </div>

            <div className='input-field col s12 m6'>
              <CreatableSelect
                isMulti
                isClearable={false}
                name='tags[]'
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder='Select tags'
                options={this.options}
              />
            </div>

            <div className='input-field col s12 m6'>
              <textarea id='times_worn' className='materialize-textarea' name='times_worn' />
              <label htmlFor='times_worn'>Times Worn</label>
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
                autoCropArea={1}
                movable={false}
                zoomable={false}
                scalable={false}
                rotatable={false}
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

export default OutfitAddForm
