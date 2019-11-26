import React, { Component } from 'react'
import M from 'materialize-css'
import axios from 'axios'
import $ from 'jquery'

import Modal from '../Modal'
import Tag from '../Tag'
import OutfitEditForm from '../forms/OutfitEditForm'

class OutfitCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: true,
      renderForm: true,
      title: (props.title !== undefined) ? props.title : 'ERROR',
      images: props.images,
      status: (props.status !== undefined) ? parseInt(props.status) : -1,
      obtained_on: (props.obtained_on !== undefined && props.obtained_on !== null) ? props.obtained_on : null,
      creator: (props.creator !== undefined && props.creator !== null) ? props.creator : null,
      storage_location: (props.storage_location !== undefined && props.storage_location !== null && props.storage_location.length) ? props.storage_location : null,
      times_worn: (props.times_worn !== undefined && props.times_worn !== null) ? props.times_worn : null,
      tags: (props.tags !== undefined && props.tags !== null) ? props.tags : [],
      allTags: (props.allTags !== undefined && props.allTags !== null) ? props.allTags : []
    }

    this.token = props.token
    this.id = (props.id !== undefined) ? props.id : null
    this.character_name = (props.character_name !== undefined) ? props.character_name : null

    this.handleDelete = this.handleDelete.bind(this)
    this.handleFormUnmount = this.handleFormUnmount.bind(this)
  }

  handleInit () {
    M.Carousel.init($('.carousel'), { fullWidth: true, indicators: true, noWrap: true })
    M.Modal.init($('.modal'))
  }

  handleDelete (e) {
    e.stopPropagation()

    if (confirm('Are you sure you want to delete this outfit [' + this.state.title + ']? This action is not reversible.')) {
      const answer = prompt('Please enter DELETE to confirm.')

      if (answer === 'DELETE') {
        axios.get('/api/outfit/destroy/' + this.id, {
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

  handleFormUnmount (data) {
    const obj = JSON.parse(data)
    if (obj) {
      this.setState({
        renderForm: false,
        title: obj.title,
        images: obj.images,
        status: (obj.status !== undefined && obj.status.length) ? parseInt(obj.status) : -1,
        obtained_on: (obj.obtained_on !== undefined && obj.obtained_on !== null) ? obj.obtained_on : null,
        creator: (obj.creator !== undefined && obj.creator !== null) ? obj.creator : null,
        storage_location: (obj.storage_location !== undefined && obj.storage_location !== null && obj.storage_location.length) ? obj.storage_location : null,
        times_worn: (obj.times_worn !== undefined && obj.times_worn !== null) ? obj.times_worn : null,
        tags: (obj.tags !== undefined) ? obj.tags : []
      }, () => {
        M.Carousel.init($('.carousel'), { fullWidth: true, indicators: true, noWrap: true })
        this.setState({
          renderForm: true
        })
      })
    }
  }

  componentDidMount () {
    window.addEventListener('DOMContentLoaded', this.handleInit)
    if (document.readyState !== 'loading') {
      setTimeout(() => {
        this.handleInit()
      }, 50)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('DOMContentLoaded', this.handleInit)
  }

  render () {
    if (this.state.visible) {
      const modalName = 'outfit-single-modal-' + this.id

      if (this.state) {
        let statusClass = ''
        // 0 = Future Cosplay, 1 = Owned & Unworn, 2 = Worn
        if (this.state.status === 0) {
          statusClass = 'outfit--future'
        } else if (this.state.status === 1) {
          statusClass = 'outfit--unworn'
        } else if (this.state.status === 2) {
          statusClass = 'outfit--worn'
        }

        let obtainedOn = ''

        if (this.state.obtained_on !== '') {
          const d = new Date(this.state.obtained_on)
          const month = d.toLocaleString('default', { month: 'long' })
          obtainedOn = month + ' ' + d.getDate() + ', ' + d.getFullYear()
        }

        return (
          <>
            <div className={'outfit ' + statusClass + ' card medium'}>
              <div className='outfit__images card-image'>
                <div className='carousel carousel-slider'>
                  {this.state.images.map((item, i) => {
                    const url = '#' + i + '!'
                    return (<a key={i} className='carousel-item' href={url}><img src={item} className='activator' /></a>)
                  })}
                </div>
              </div>

              <div className='card-action'>
                <div className='outfit__icon modal-trigger' data-target={modalName} onClick={(e) => e.stopPropagation()}>
                  <a className='btn-flat teal lighten-2'><i className='material-icons'>edit</i></a>
                </div>

                { this.character_name
                  ? <span className='activator' style={{ padding: '8px', overflow: 'hidden' }}>
                    <div className='outfit__character'>
                      {this.character_name}
                    </div>
                    <div className='outfit__title'>{this.state.title}</div>
                    <div className='outfit__tags'>
                      { this.state.tags.map((item, i) => {
                        return (<Tag key={i}>{item.label}</Tag>)
                      })}
                    </div>
                  </span>
                  : <span className='activator' style={{ padding: '16px', overflow: 'hidden' }}>
                    <div className='outfit__title'>{this.state.title}</div>
                    <div className='outfit__tags'>
                      { this.state.tags.map((item, i) => {
                        return (<Tag key={i}>{item.label}</Tag>)
                      })}
                    </div>
                  </span>
                }

                <div className='outfit__icon' onClick={this.handleDelete}>
                  <a className='btn-flat red lighten-2'><i className='material-icons'>delete</i></a>
                </div>
              </div>

              <div className='card-reveal'>
                <span className='card-title grey-text text-darken-4'>{this.state.title}<i className='material-icons right'>close</i></span>
                <ul>
                  <li><strong>Obtained On:</strong> {obtainedOn}</li>
                  <li><strong>Creator:</strong> {this.state.creator}</li>
                  <li><strong>Storage Location:</strong> {this.state.storage_location}</li>
                  <li><strong>Times Worn:</strong> {this.state.times_worn}</li>
                </ul>
              </div>
            </div>

            <Modal id={modalName}>
              { this.state.renderForm &&
                <OutfitEditForm
                  token={this.token}
                  id={this.id}
                  title={this.state.title}
                  status={this.state.status}
                  obtained_on={this.state.obtained_on}
                  creator={this.state.creator}
                  storage_location={this.state.storage_location}
                  times_worn={this.state.times_worn}
                  tags={this.state.tags}
                  options={this.state.allTags}
                  unmount={this.handleFormUnmount} />
              }
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

export default OutfitCard
