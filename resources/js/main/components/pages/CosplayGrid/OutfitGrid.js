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

  componentDidMount () {
    window.addEventListener('DOMContentLoaded', this.handleInit)
    if (document.readyState !== 'loading') {
      this.handleInit()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('DOMContentLoaded', this.handleInit)
  }

  render () {
    return (
      <main>
        <h5>Series Name - Character Name</h5>
        <div className='outfit-grid'>
          <OutfitCard title='Card 1' />
          <OutfitCard title='Card 2' />
          <OutfitCard title='Card 3' />
          <OutfitCard title='Card 4' />
          <OutfitCard title='Card 5' />
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
