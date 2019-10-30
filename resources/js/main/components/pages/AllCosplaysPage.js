import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'

// Components
import Helper from '../Helper'

class AllCosplaysPage extends Component {
  constructor (props) {
    super(props)

    this.token = Helper.getToken()
  }

  render () {
    return (
      <main>
        <h5>All Cosplays Page</h5>
        <p>This is the point where you see all the cosplays.</p>
      </main>
    )
  }
}

export default AllCosplaysPage
