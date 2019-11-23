import React, { Component } from 'react'
import M from 'materialize-css'
import $ from 'jquery'

class OutfitCard extends Component {
  constructor (props) {
    super(props)

    this.id = (props.id !== undefined) ? props.id : null
    this.title = (props.title !== undefined) ? props.title : 'Default Title'
    this.images = (props.images !== undefined && props.images !== null && props.images.length) ? props.images : ['https://via.placeholder.com/342', 'https://via.placeholder.com/322']
    this.status = (props.status !== undefined && props.status !== null) ? props.status : -1
    this.bought_date = (props.bought_date !== undefined && props.bought_date !== null) ? props.bought_date : 'N/A'
    this.storage_location = (props.storage_location !== undefined && props.storage_location !== null) ? props.storage_location : 'N/A'
    this.times_worn = (props.times_worn !== undefined && props.times_worn !== null) ? props.times_worn : 'N/A'

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
    console.log('clicked on delete button for id: ' + this.id)
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
    if (this.status === 0) {
      statusClass = 'outfit--future'
    } else if (this.status === 1) {
      statusClass = 'outfit--unworn'
    } else if (this.status === 2) {
      statusClass = 'outfit--worn'
    }

    return (
      <div className={'outfit ' + statusClass + ' card medium'}>
        <div className='outfit__images card-image'>
          <div className='carousel carousel-slider'>
            {this.images.map((item, i) => {
              const url = '#' + i + '!'
              return (<a key={i} className='carousel-item' href={url}><img src={item} className='activator' /></a>)
            })}
          </div>
        </div>

        <div className='card-action'>
          <div className='outfit__icon' onClick={this.handleEdit}>
            <a className='btn-flat teal lighten-2'><i className='material-icons'>edit</i></a>
          </div>

          <span className='activator'>{this.title}</span>

          <div className='outfit__icon' onClick={this.handleDelete}>
            <a className='btn-flat red lighten-2'><i className='material-icons'>delete</i></a>
          </div>
        </div>

        <div className='card-reveal'>
          <span className='card-title grey-text text-darken-4'>{this.title}<i className='material-icons right'>close</i></span>
          <ul>
            <li><strong>Bought Date:</strong> {this.bought_date}</li>
            <li><strong>Storage Location:</strong> {this.storage_location}</li>
            <li><strong>Times Worn:</strong> {this.times_worn}</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default OutfitCard
