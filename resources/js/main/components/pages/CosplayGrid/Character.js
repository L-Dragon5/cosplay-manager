import React, { Component } from 'react'

class Character extends Component {
  constructor (props) {
    super(props)

    this.id = (props.id !== undefined) ? props.id : null
    this.name = (props.name !== undefined) ? props.name : 'Default Character'
    this.image = (props.image !== undefined && props.image !== null) ? ('/storage/' + props.image) : 'https://via.placeholder.com/200x400'
    this.seriesID = (props.seriesID !== undefined) ? props.seriesID : null
    this.outfitCount = (props.outfitCount !== undefined) ? (props.outfitCount + ' Outfits') : '0 Outfits'


    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    window.location.href = '/s-' + this.seriesID + '/c-' + this.id
  }

  render () {
    return (
      <div className='character' onClick={this.handleClick}>
        <div className='character__image'>
          <img src={this.image} />
        </div>
        <div className='character__name'>
          {this.name}<br />{this.outfitCount}
        </div>
      </div>
    )
  }
}

export default Character
