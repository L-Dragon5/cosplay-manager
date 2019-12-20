import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

import Modal from '../../Modal'
import SeriesEditForm from '../../forms/SeriesEditForm'

class Series extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: true,
      title: (props.title !== undefined) ? props.title : 'ERROR',
      image: props.image
    }

    this.token = props.token

    this.id = (props.id !== undefined) ? props.id : null
    this.characterCount = (props.characterCount !== undefined) ? (props.characterCount + (props.characterCount === 1 ? ' Character' : ' Characters')) : '0 Characters'

    this.handleClick = this.handleClick.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleFormUnmount = this.handleFormUnmount.bind(this)
  }

  handleClick () {
    window.location.href = '/s-' + this.id
  }

  handleDelete (e) {
    e.stopPropagation()

    if (confirm('Are you sure you want to delete this series [' + this.state.title + ']? This will delete all characters and outfit in this series and is not reversible.')) {
      const answer = prompt('Please enter DELETE to confirm.')

      if (answer === 'DELETE') {
        axios.get('/api/series/destroy/' + this.id, {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + this.token,
            'content-type': 'multipart/form-data'
          }
        }).then((response) => {
          if (response.status === 200) {
            M.toast({ html: response.data.message })
            this.setState({
              visible: false
            })
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

            M.toast({ html: html })
          }
        })
      } else {
        M.toast({ html: 'Deletion cancelled' })
      }
    }
  }

  handleInit () {
    M.Modal.init($('.modal'))
  }

  handleFormUnmount (data) {
    const obj = JSON.parse(data)
    if (obj) {
      this.setState({
        title: obj.title,
        image: obj.image
      })
    }
  }

  componentDidMount () {
    window.addEventListener('DOMContentLoaded', this.handleInit)
    if (document.readyState !== 'loading') {
      this.handleInit()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('DOMContentLoaded', this.handleInit)
  }

  render () {
    if (this.state.visible) {
      const modalName = 'series-single-modal-' + this.id

      if (this.state.title && this.state.image) {
        return (
          <>
            <div className='series' onClick={this.handleClick}>
              <div className='series__image'>
                <img src={this.state.image} draggable={false} />
              </div>
              <div className='series__title'>
                <div className='series__icon modal-trigger' data-target={modalName} onClick={(e) => e.stopPropagation()}>
                  <a className='btn-flat teal lighten-2'><i className='material-icons'>edit</i></a>
                </div>

                <div className='series__title__text'>
                  {this.state.title}<br />{this.characterCount}
                </div>

                <div className='series__icon' onClick={this.handleDelete}>
                  <a className='btn-flat red lighten-2'><i className='material-icons'>delete</i></a>
                </div>
              </div>
            </div>

            <Modal id={modalName}>
              <SeriesEditForm token={this.token} id={this.id} title={this.state.title} unmount={this.handleFormUnmount} />
            </Modal>
          </>
        )
      } else {
        return null
      }
    } else {
      return null
    }
  }
}

export default Series
