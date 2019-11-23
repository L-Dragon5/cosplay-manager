import React, { Component } from 'react'

class Series extends Component {
  constructor (props) {
    super(props)

    this.id = (props.id !== undefined) ? props.id : null
    this.title = (props.title !== undefined) ? props.title : 'Default Series'
    this.image = (props.image !== undefined && props.image !== null) ? ('/storage/' + props.image) : 'https://via.placeholder.com/300x200'
    this.characterCount = (props.characterCount !== undefined) ? (props.characterCount + ' Characters') : '0 Characters'

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    window.location.href = '/s-' + this.id
  }

  render () {
    return (
      <div className='series' onClick={this.handleClick}>
        <div className='series__image'>
          <img src={this.image} />
        </div>
        <div className='series__title'>
          {this.title}<br />{this.characterCount}
        </div>
      </div>
    )
  }
}

export default Series
