import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'

// Components
import Helper from '../Helper'

class SeriesGridPage extends Component {
  constructor (props) {
    super(props)

    this.token = Helper.getToken()
  }

  render () {
    return (
      <main>
        <h5>Series Grid Page</h5>
        <p>Welcome to the starting point.</p>
      </main>
    )
  }
}

export default SeriesGridPage
