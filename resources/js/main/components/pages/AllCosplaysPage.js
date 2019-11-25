import React, { Component } from 'react'
import axios from 'axios'

// Components
import Helper from '../Helper'
import OutfitCard from './OutfitCard'

class AllCosplaysPage extends Component {
  constructor (props) {
    super(props)

    /**
     * Filter
     * 0 = none
     * 1 = future
     * 2 = owned & unworn
     * 4 = worn
     */
    this.state = {
      allOutfits: null, // All outfits available
      outfits: null, // Outfits being displayed
      search: null, // Search input
      searchBlank: true, // Is the search input blank
      filter: 7 // Filter mask
    }

    this.token = Helper.getToken()

    this.handleSearch = this.handleSearch.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
  }

  handleSearch (e) {
    let searchVal = ''

    // Is the function coming from input change or from handleFilterStateChange callback?
    if (e === undefined || e.target === undefined || e.target.value === undefined) {
      // If search is blank and coming from callback, return to prevent loop
      if (this.state.searchBlank) {
        return
      }

      // Set search value from state
      searchVal = this.state.search
    } else {
      // Set search value from input
      searchVal = e.target.value

      // Update search state
      this.setState({
        search: e.target.value
      })
    }

    // If the search value is blank
    if (searchVal.length < 1) {
      // Reset outfits to all and then reapply filters
      this.setState({
        outfits: this.state.allOutfits,
        searchBlank: true
      }, this.handleFilterStateChange)
    } else {
      // Lowercase search to make it uniform in searching
      const lowerSearch = searchVal.toLowerCase()

      // Set displaying outfits based on search text
      this.setState({
        outfits: this.state.outfits.filter(item => (String(item.title).toLowerCase()).indexOf(lowerSearch) !== -1),
        searchBlank: false
      })
    }
  }

  handleStatusChange (e) {
    if (e.target.checked) {
      this.setState({
        filter: this.state.filter + parseInt(e.target.value)
      }, this.handleFilterStateChange)
    } else {
      this.setState({
        filter: this.state.filter - parseInt(e.target.value)
      }, this.handleFilterStateChange)
    }
  }

  handleFilterStateChange () {
    switch (this.state.filter) {
      case 0: // None
        this.setState({
          outfits: null
        })
        break
      case 1: // Future Only
        this.setState({
          outfits: this.state.allOutfits.filter(item => (item.status === 0))
        }, this.handleSearch)
        break
      case 2: // Unworn Only
        this.setState({
          outfits: this.state.allOutfits.filter(item => (item.status === 1))
        }, this.handleSearch)
        break
      case 3: // Future + Unworn
        this.setState({
          outfits: this.state.allOutfits.filter(item => (item.status === 0 || item.status === 1))
        }, this.handleSearch)
        break
      case 4: // Worn Only
        this.setState({
          outfits: this.state.allOutfits.filter(item => (item.status === 2))
        }, this.handleSearch)
        break
      case 5: // Future + Worn
        this.setState({
          outfits: this.state.allOutfits.filter(item => (item.status === 0 || item.status === 2))
        }, this.handleSearch)
        break
      case 6: // Unworn + Worn
        this.setState({
          outfits: this.state.allOutfits.filter(item => (item.status === 1 || item.status === 2))
        }, this.handleSearch)
        break
      case 7: // Future + Unworn + Worn
        this.setState({
          outfits: this.state.allOutfits
        }, this.handleSearch)
        break
    }
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
          allOutfits: response.data,
          outfits: response.data
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
    document.title = 'All Cosplays | CosManage'
    this.getOutfits()
  }

  render () {
    const outfits = this.state.outfits

    return (
      <main>
        <h5>All Cosplays</h5>

        <div className='filters row'>
          <div className='input-field col s12 m6'>
            <input id='searchInput' className='filters__search' type='text' onChange={this.handleSearch} />
            <label htmlFor='searchInput'>Search</label>
          </div>
          <div className='col s12 m6'>
            <span className='filters__checkbox'>
              <label>
                <input type='checkbox' value='1' onChange={this.handleStatusChange} defaultChecked />
                <span>Future</span>
              </label>
            </span>

            <span className='filters__checkbox'>
              <label>
                <input type='checkbox' value='2' onChange={this.handleStatusChange} defaultChecked />
                <span>Owned & Unworn</span>
              </label>
            </span>

            <span className='filters__checkbox'>
              <label>
                <input type='checkbox' value='4' onChange={this.handleStatusChange} defaultChecked />
                <span>Worn</span>
              </label>
            </span>
          </div>
        </div>

        <div className='outfit-grid'>
          { outfits &&
            outfits.map((item, key) => {
              return <OutfitCard
                key={'o-' + item.id}
                token={this.token}
                id={item.id}
                character_name={item.character_name}
                title={item.title}
                images={item.images}
                status={item.status}
                obtained_on={item.obtained_on}
                creator={item.creator}
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
