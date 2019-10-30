import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

// Components
import Helper from '../../Helper'
import Series from './Series'

class SeriesGrid extends Component {
  constructor (props) {
    super(props)

    this.token = Helper.getToken()

    this.handleAdd = this.handleAdd.bind(this)
  }

  handleAdd () {
    console.log('clicked on add series button')
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
      <div>
        <div className='series-grid'>
          <Series title='Series 1' />
          <Series title='Series 2' />
        </div>

        <div className='fixed-action-btn'>
          <a className='btn-large red' style={{ display: 'flex' }} onClick={this.handleAdd}>
            <i className='large material-icons'>add</i><span>Add Series</span>
          </a>
        </div>
      </div>
    )
  }
}

export default SeriesGrid
