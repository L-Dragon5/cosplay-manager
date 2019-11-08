import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

// Components
import Helper from '../../Helper'
import OutfitCard from '../OutfitCard'

class OutfitGrid extends Component {
  constructor (props) {
    super(props)

    this.state = {
      seriesTitle: null,
      characterName: null,
      outfits: null
    }

    this.seriesID = (props.match.params.series !== undefined) ? props.match.params.series : null
    this.characterID = (props.match.params.character !== undefined) ? props.match.params.character : null
    this.token = Helper.getToken()

    this.handleAdd = this.handleAdd.bind(this)
  }

  handleAdd () {
    console.log('clicked on add outfit button')
  }

  handleInit () {
    M.FloatingActionButton.init($('.fixed-action-btn'))
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
        console.error(error.response)
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
        console.error(error.response)
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
          outfits: response.data
        })
      }
    }).catch(error => {
      if (error.response) {
        console.error(error.response)
      }
    })
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
                id={item.id}
                title={item.title}
                images={item.images}
                bought_date={item.bought_date}
                storage_location={item.storage_location}
                times_worn={item.times_worn} />
            })
          }
        </div>

        <div className='fixed-action-btn'>
          <a className='btn-large red' style={{ display: 'flex' }} onClick={this.handleAdd}>
            <i className='large material-icons'>add</i><span>Add Outfit
            </span>
          </a>
        </div>
      </main>
    )
  }
}

export default OutfitGrid
