import React, { Component } from 'react'
import M from 'materialize-css'
import axios from 'axios'
import $ from 'jquery'

class OutfitCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: true,
      title: (props.title !== undefined) ? props.title : 'ERROR',
      images: props.images,
      status: (props.status !== undefined && props.status !== null) ? props.status : -1,
      bought_date: (props.bought_date !== undefined && props.bought_date !== null) ? props.bought_date : 'N/A',
      storage_location: (props.storage_location !== undefined && props.storage_location !== null) ? props.storage_location : 'N/A',
      times_worn: (props.times_worn !== undefined && props.times_worn !== null) ? props.times_worn : 'N/A'
    }

    this.token = props.token
    this.id = (props.id !== undefined) ? props.id : null

    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleInit () {
    M.Carousel.init($('.carousel'), { fullWidth: true, indicators: true, noWrap: true })
  }

  handleEdit (e) {
    e.stopPropagation()
    console.log('clicked on edit button for id: ' + this.id)
  }

  handleDelete (e) {
    e.stopPropagation()

    if (confirm('Are you sure you want to delete this outfit [' + this.title + ']? This action is not reversible.')) {
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
    let statusClass = ''
    // 0 = Future Cosplay, 1 = Owned & Unworn, 2 = Worn
    if (this.state.status === 0) {
      statusClass = 'outfit--future'
    } else if (this.state.status === 1) {
      statusClass = 'outfit--unworn'
    } else if (this.state.status === 2) {
      statusClass = 'outfit--worn'
    }

    if (this.state.visible) {
      return (
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
            <div className='outfit__icon' onClick={this.handleEdit}>
              <a className='btn-flat teal lighten-2'><i className='material-icons'>edit</i></a>
            </div>

            <span className='activator'>{this.state.title}</span>

            <div className='outfit__icon' onClick={this.handleDelete}>
              <a className='btn-flat red lighten-2'><i className='material-icons'>delete</i></a>
            </div>
          </div>

          <div className='card-reveal'>
            <span className='card-title grey-text text-darken-4'>{this.state.title}<i className='material-icons right'>close</i></span>
            <ul>
              <li><strong>Bought Date:</strong> {this.state.bought_date}</li>
              <li><strong>Storage Location:</strong> {this.state.storage_location}</li>
              <li><strong>Times Worn:</strong> {this.state.times_worn}</li>
            </ul>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default OutfitCard
