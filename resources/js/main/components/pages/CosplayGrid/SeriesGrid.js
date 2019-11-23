import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css'
import $ from 'jquery'

// Components
import Helper from '../../Helper'
import Modal from '../../Modal'
import Series from './Series'
import SeriesAddForm from '../../forms/SeriesAddForm'

class SeriesGrid extends Component {
  constructor (props) {
    super(props)

    this.state = {
      series: null,
      renderForm: false
    }

    this.token = Helper.getToken()

    this.handleFormUnmount = this.handleFormUnmount.bind(this)
  }

  getSeries () {
    axios.get('/api/series', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      }
    }).then(response => {
      if (response.data) {
        this.setState({
          series: response.data,
          renderForm: true
        })
      }
    }).catch(error => {
      if (error.response) {
        console.error(error.response)
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

    this.getSeries()
  }

  componentDidMount () {
    this.getSeries()

    document.title = 'Series Grid | Cosplay Manager'

    window.addEventListener('DOMContentLoaded', this.handleInit)
    if (document.readyState !== 'loading') {
      this.handleInit()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('DOMContentLoaded', this.handleInit)
  }

  render () {
    const series = this.state.series

    return (
      <main>
        <h5>Series</h5>
        <div className='series-grid'>
          { series &&
            series.map((item, key) => {
              return <Series key={'s-' + item.id} id={item.id} title={item.title} image={item.image} />
            })
          }
        </div>

        <div className='fixed-action-btn modal-trigger' data-target='series-grid-modal'>
          <a className='btn-large red' style={{ display: 'flex' }}>
            <i className='large material-icons'>add</i><span>Add Series</span>
          </a>
        </div>

        <Modal id='series-grid-modal'>
          { this.state.renderForm ? <SeriesAddForm token={this.token} unmount={this.handleFormUnmount} /> : null }
        </Modal>
      </main>
    )
  }
}

export default SeriesGrid
