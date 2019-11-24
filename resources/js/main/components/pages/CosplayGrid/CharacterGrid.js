import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

// Components
import Helper from '../../Helper'
import Modal from '../../Modal'
import Character from './Character'
import CharacterAddForm from '../../forms/CharacterAddForm'

class CharacterGrid extends Component {
  constructor (props) {
    super(props)

    this.state = {
      seriesTitle: null,
      characters: null,
      renderForm: false
    }

    this.seriesID = (props.match.params.series !== undefined) ? props.match.params.series : null
    this.token = Helper.getToken()

    this.handleFormUnmount = this.handleFormUnmount.bind(this)
  }

  getSeriesTitle () {
    axios.get('/api/series/' + this.seriesID, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      }
    }).then(response => {
      if (response.data) {
        this.setState({
          seriesTitle: response.data.title
        })

        if (this.state.seriesTitle !== null) {
          document.title = '[' + this.state.seriesTitle + '] Characters | Cosplay Manager'
        }
      }
    }).catch(error => {
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
  }

  getCharacters () {
    axios.get('/api/characters/' + this.seriesID, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      }
    }).then(response => {
      if (response.data) {
        this.setState({
          characters: response.data,
          renderForm: true
        })
      }
    }).catch(error => {
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
  }

  handleInit () {
    M.Modal.init($('.modal'))
    M.FloatingActionButton.init($('.fixed-action-btn'))
  }

  handleFormUnmount () {
    this.setState({
      renderForm: false
    })

    this.getCharacters()
  }

  componentDidMount () {
    this.getSeriesTitle()
    this.getCharacters()

    window.addEventListener('DOMContentLoaded', this.handleInit)
    if (document.readyState !== 'loading') {
      this.handleInit()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('DOMContentLoaded', this.handleInit)
  }

  render () {
    const characters = this.state.characters
    const seriesTitle = this.state.seriesTitle

    return (
      <main>
        <h5>{seriesTitle}</h5>
        <div className='character-grid'>
          { characters &&
            characters.map((item, key) => {
              return <Character
                key={'c-' + item.id}
                token={this.token}
                id={item.id}
                seriesID={this.seriesID}
                name={item.name}
                image={item.image}
                outfitCount={item.outfit_count} />
            })
          }
        </div>

        <div className='fixed-action-btn modal-trigger' data-target='character-grid-modal'>
          <a className='btn-large red' style={{ display: 'flex' }}>
            <i className='large material-icons'>add</i><span>Add Character
            </span>
          </a>
        </div>

        <Modal id='character-grid-modal'>
          { this.state.renderForm ? <CharacterAddForm token={this.token} seriesID={this.seriesID} unmount={this.handleFormUnmount} /> : null }
        </Modal>
      </main>
    )
  }
}

export default CharacterGrid
