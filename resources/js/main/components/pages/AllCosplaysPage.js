import React, { Component } from 'react'
import axios from 'axios'

// Components
import Helper from '../Helper'
import OutfitCard from './OutfitCard'

class AllCosplaysPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      outfits: null
    }

    this.token = Helper.getToken()
  }

  getOutfits () {
    axios.get('/api/outfits/', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      }
    }).then(response => {
      if (response.data) {
        this.setState({
          outfits: response.data,
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

  componentDidMount () {
    document.title = 'All Cosplays | Cosplay Manager'
    this.getOutfits()
  }

  render () {
    const outfits = this.state.outfits

    return (
      <main>
        <h5>All Cosplays</h5>
        <div className='outfit-grid'>
          { outfits &&
            outfits.map((item, key) => {
              return <OutfitCard
                key={'o-' + item.id}
                token={this.token}
                id={item.id}
                title={item.title}
                images={item.images}
                status={item.status}
                bought_date={item.bought_date}
                storage_location={item.storage_location}
                times_worn={item.times_worn} />
            })
          }
        </div>
      </main>
    )
  }
}

export default AllCosplaysPage
