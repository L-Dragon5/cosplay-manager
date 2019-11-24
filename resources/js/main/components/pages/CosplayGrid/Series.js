import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'

class Series extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: true
    }

    this.token = props.token

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

    if (confirm('Are you sure you want to delete this series [' + this.title + ']? This will delete all characters and outfit in this series and is not reversible.')) {
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
            var html = ''
            for (const [key, value] of Object.entries(error.response.data.message)) {
              html += key + ': ' + value + '<br>'
            }
            M.toast({ html: html })
          }
        })
      } else {
        M.toast({ html: 'Deletion cancelled' })
      }
    }
  }

  render () {
    if (this.state.visible) {
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
    } else {
      return null
    }
  }
}

export default Series
