import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'

class Character extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: true
    }

    this.token = props.token

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

    if (confirm('Are you sure you want to delete this character [' + this.name + ']? This will delete all outfits in this character and is not reversible.')) {
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
    } else {
      return null
    }
  }
}

export default Character
