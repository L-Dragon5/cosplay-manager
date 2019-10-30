import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

// Components
import Helper from '../../Helper'
import Card from '../Card'

class OutfitGrid extends Component {
  constructor (props) {
    super(props)

    this.token = Helper.getToken()
  }

  render () {
    return (
      <div className='outfit-grid'>
        <Card title='Card 1' />
        <Card title='Card 2' />
        <Card title='Card 3' />
        <Card title='Card 4' />
        <Card title='Card 5' />
      </div>
    )
  }
}

export default OutfitGrid
