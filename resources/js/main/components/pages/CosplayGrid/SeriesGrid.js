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

    this.state = {
      series: null
    }

    this.token = Helper.getToken()

    this.handleAdd = this.handleAdd.bind(this)
  }

  handleAdd () {
    console.log('clicked on add series button')
  }

  handleInit () {
    M.FloatingActionButton.init($('.fixed-action-btn'))
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
          series: response.data
        })
      }
    }).catch(error => {
      if (error.response) {
        console.error(error.response)
      }
    })
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

        <div className='fixed-action-btn'>
          <a className='btn-large red' style={{ display: 'flex' }} onClick={this.handleAdd}>
            <i className='large material-icons'>add</i><span>Add Series</span>
          </a>
        </div>
      </main>
    )
  }
}

export default SeriesGrid
