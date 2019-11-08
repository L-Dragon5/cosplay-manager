import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

// Components
import Helper from '../../Helper'
import Character from './Character'

class CharacterGrid extends Component {
  constructor (props) {
    super(props)

    this.seriesID = (props.match.params.series !== undefined) ? props.match.params.series : null
    this.token = Helper.getToken()

    this.handleAdd = this.handleAdd.bind(this)
  }

  handleAdd () {
    console.log('clicked on add character button')
  }

  handleInit () {
    M.FloatingActionButton.init($('.fixed-action-btn'))
  }

  componentDidMount () {
    document.title = '[Series] Characters | Cosplay Manager'

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
        <h5>Series Name</h5>
        <div className='character-grid'>
          <Character key='c-1' id={1} title='Character 1' seriesID={this.seriesID} />
          <Character key='c-2' id={2} title='Character 2' seriesID={this.seriesID} />
          <Character key='c-3' id={3} title='Character 3' seriesID={this.seriesID} />
        </div>

        <div className='fixed-action-btn'>
          <a className='btn-large red' style={{ display: 'flex' }} onClick={this.handleAdd}>
            <i className='large material-icons'>add</i><span>Add Character
            </span>
          </a>
        </div>
      </main>
    )
  }
}

export default CharacterGrid
