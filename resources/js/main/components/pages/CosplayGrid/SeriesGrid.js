import React, { Component } from 'react'
import axios from 'axios'

// Components
import Helper from '../../Helper'
import { Modal } from '@material-ui/core';
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

    this.getSeries()
  }

  componentDidMount () {
    this.getSeries()

    document.title = 'Series Grid | CosManage'

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
              return <Series
                key={'s-' + item.id}
                token={this.token}
                id={item.id}
                title={item.title}
                image={item.image}
                characterCount={item.character_count} />
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
