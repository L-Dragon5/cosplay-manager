import React, { Component } from 'react'

class Changelog extends Component {
  render () {
    return (
      <div className='row'>
        <div className='col s12'>
          <h3>Changelog</h3>
          <div className='divider' />

          <div style={{ height: '400px', overflow: 'auto' }}>

            <div className='section'>
              <h5>November 25th, 2019</h5>
              <p>Initial release.</p>
            </div>

            <div className='divider' />
            <div className='section'>
              <h5>November 25th, 2019</h5>
              <p>Added a tagging system for outfits. Search functionality for tags might come later as it's very difficult to implement.</p>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default Changelog
