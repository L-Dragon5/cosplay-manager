import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

// Components
import Helper from '../../Helper'
import Modal from '../../Modal'
import OutfitCard from '../OutfitCard'
import OutfitAddForm from '../../forms/OutfitAddForm'

class OutfitGrid extends Component {
  constructor (props) {
    super(props)

    this.state = {
      seriesTitle: null,
      characterName: null,
      outfits: null,
      renderForm: false
    }

    this.seriesID = (props.match.params.series !== undefined) ? props.match.params.series : null
    this.characterID = (props.match.params.character !== undefined) ? props.match.params.character : null
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
          document.title = '[' + this.state.seriesTitle + '] Character Name | Cosplay Manager'
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

  getCharacterName () {
    axios.get('/api/character/' + this.characterID, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      }
    }).then(response => {
      if (response.data) {
        this.setState({
          characterName: response.data.name
        })

        if (this.state.seriesTitle !== null) {
          document.title = '[' + this.state.seriesTitle + '] ' + this.state.characterName + ' | Cosplay Manager'
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

  getOutfits () {
    axios.get('/api/outfits/' + this.characterID, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      }
    }).then(response => {
      if (response.data) {
        this.setState({
          outfits: response.data,
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

    this.getOutfits()
  }

  componentDidMount () {
    this.getSeriesTitle()
    this.getCharacterName()
    this.getOutfits()

    window.addEventListener('DOMContentLoaded', this.handleInit)
    if (document.readyState !== 'loading') {
      this.handleInit()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('DOMContentLoaded', this.handleInit)
  }

  render () {
    const outfits = this.state.outfits
    const seriesTitle = this.state.seriesTitle
    const characterName = this.state.characterName

    return (
      <main>
        <h5>{seriesTitle} - {characterName}</h5>
        <div className='outfit-grid'>
          { outfits &&
            outfits.map((item, key) => {
              return <OutfitCard
                key={'o-' + item.id}
                token={this.token}
                id={item.id}
                title={item.title}
                images={item.images}
                status={item.status}
                bought_date={item.bought_date}
                storage_location={item.storage_location}
                times_worn={item.times_worn} />
            })
          }
        </div>

        <div className='fixed-action-btn modal-trigger' data-target='outfit-grid-modal'>
          <a className='btn-large red' style={{ display: 'flex' }}>
            <i className='large material-icons'>add</i><span>Add Outfit
            </span>
          </a>
        </div>

        <Modal id='outfit-grid-modal'>
          { this.state.renderForm ? <OutfitAddForm token={this.token} characterID={this.characterID} unmount={this.handleFormUnmount} /> : null }
        </Modal>
      </main>
    )
  }
}

export default OutfitGrid
