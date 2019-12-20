import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

import Modal from '../../Modal'
import CharacterEditForm from '../../forms/CharacterEditForm'

class Character extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: true,
      name: (props.name !== undefined) ? props.name : 'ERROR',
      image: props.image
    }

    this.token = props.token

    this.id = (props.id !== undefined) ? props.id : null
    this.seriesID = (props.seriesID !== undefined) ? props.seriesID : null
    this.outfitCount = (props.outfitCount !== undefined) ? (props.outfitCount + (props.outfitCount === 1 ? ' Outfit' : ' Outfits')) : '0 Outfits'

    this.handleClick = this.handleClick.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleFormUnmount = this.handleFormUnmount.bind(this)
  }

  handleClick () {
    window.location.href = '/s-' + this.seriesID + '/c-' + this.id
  }

  handleDelete (e) {
    e.stopPropagation()

    if (confirm('Are you sure you want to delete this character [' + this.state.name + ']? This will delete all outfits in this character and is not reversible.')) {
      const answer = prompt('Please enter DELETE to confirm.')

      if (answer === 'DELETE') {
        axios.get('/api/character/destroy/' + this.id, {
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
        name: obj.name,
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

      if (this.state.name && this.state.image) {
        return (
          <>
            <div className='character' onClick={this.handleClick}>
              <div className='character__image'>
                <img src={this.state.image} draggable={false} />
              </div>
              <div className='character__name'>
                <div className='character__icon modal-trigger' data-target={modalName} onClick={(e) => e.stopPropagation()}>
                  <a className='btn-flat teal lighten-2'><i className='material-icons'>edit</i></a>
                </div>

                <div className='character__name__text'>
                  {this.state.name}<br />{this.outfitCount}
                </div>

                <div className='character__icon' onClick={this.handleDelete}>
                  <a className='btn-flat red lighten-2'><i className='material-icons'>delete</i></a>
                </div>
              </div>
            </div>

            <Modal id={modalName}>
              <CharacterEditForm token={this.token} id={this.id} name={this.state.name} unmount={this.handleFormUnmount} />
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

export default Character
