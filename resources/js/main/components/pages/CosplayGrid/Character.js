import React, { Component } from 'react'

class Character extends Component {
  constructor (props) {
    super(props)

    this.id = (props.id !== undefined) ? props.id : null
    this.name = (props.name !== undefined) ? props.name : 'Default Character'
    this.image = (props.image !== undefined && props.image !== null) ? ('/storage/' + props.image) : 'https://via.placeholder.com/200x400'
    this.seriesID = (props.seriesID !== undefined) ? props.seriesID : null
    this.outfitCount = (props.outfitCount !== undefined) ? (props.outfitCount + (props.outfitCount === 1 ? ' Outfit' : ' Outfits')) : '0 Outfits'

    this.handleClick = this.handleClick.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleClick () {
    window.location.href = '/s-' + this.seriesID + '/c-' + this.id
  }

  handleEdit (e) {
    e.stopPropagation()
    console.log('clicked on edit button for id: ' + this.id)
  }

  handleDelete (e) {
    e.stopPropagation()
    console.log('clicked on delete button for id: ' + this.id)
  }

  render () {
    return (
      <div className='character' onClick={this.handleClick}>
        <div className='character__image'>
          <img src={this.image} />
        </div>
        <div className='character__name'>
          <div className='character__icon' onClick={this.handleEdit}>
            <a className='btn-flat teal lighten-2'><i className='material-icons'>edit</i></a>
          </div>

          <div className='character__name__text'>
            {this.name}<br />{this.outfitCount}
          </div>

          <div className='character__icon' onClick={this.handleDelete}>
            <a className='btn-flat red lighten-2'><i className='material-icons'>delete</i></a>
          </div>
        </div>
      </div>
    )
  }
}

export default Character
