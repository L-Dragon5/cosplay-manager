import React, { Component } from 'react'

class Series extends Component {
  constructor (props) {
    super(props)

    this.id = (props.id !== undefined) ? props.id : null
    this.title = (props.title !== undefined) ? props.title : 'Default Series'
    this.image = (props.image !== undefined && props.image !== null) ? ('/storage/' + props.image) : 'https://via.placeholder.com/300x200'
    this.characterCount = (props.characterCount !== undefined) ? (props.characterCount + (props.characterCount === 1 ? ' Character' : ' Characters')) : '0 Characters'

    this.handleClick = this.handleClick.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleClick () {
    window.location.href = '/s-' + this.id
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
      <div className='series' onClick={this.handleClick}>
        <div className='series__image'>
          <img src={this.image} />
        </div>
        <div className='series__title'>
          <div className='series__icon' onClick={this.handleEdit}>
            <a className='btn-flat teal lighten-2'><i className='material-icons'>edit</i></a>
          </div>

          <div className='series__title__text'>
            {this.title}<br />{this.characterCount}
          </div>

          <div className='series__icon' onClick={this.handleDelete}>
            <a className='btn-flat red lighten-2'><i className='material-icons'>delete</i></a>
          </div>
        </div>
      </div>
    )
  }
}

export default Series
