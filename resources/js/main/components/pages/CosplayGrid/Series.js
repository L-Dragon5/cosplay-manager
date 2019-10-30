import React, { Component } from 'react'

class Series extends Component {
  constructor (props) {
    super(props)

    this.title = (props.title !== undefined) ? props.title : 'Default Series'
    this.image = (props.image !== undefined) ? props.image : 'https://via.placeholder.com/300'
  }

  render () {
    return (
      <div className='series'>
        <div className='series__image'>
          <img src={this.image} />
        </div>
        <div className='series__title'>
          {this.title}
        </div>
      </div>
    )
  }
}

export default Series
