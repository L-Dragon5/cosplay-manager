import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import M from 'materialize-css'
import $ from 'jquery'

import Modal from '../Modal'
import Changelog from '../include/Changelog'

class Navbar extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  getNavLinkClass (path) {
    return this.props.location.pathname === path
      ? 'active'
      : ''
  }

  handleInit () {
    M.Sidenav.init($('.sidenav'))
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
      <>
        <div>
          <nav className='sticky-nav'>
            <div className='nav-wrapper'>
              <NavLink to='/' exact className='brand-logo'>Cosplay Manager</NavLink>
              <a href='#' data-target='mobile-nav' className='sidenav-trigger'><i className='material-icons'>menu</i></a>
              <ul className='right hide-on-med-and-down'>
                <li className={this.getNavLinkClass('/')}><NavLink to='/' exact activeClassName='active'>Cosplay Grid</NavLink></li>
                <li className={this.getNavLinkClass('/all-cosplays')}><NavLink to='/all-cosplays' activeClassName='active'>All Cosplays</NavLink></li>
                <li className='modal-trigger' data-target='changelog-modal'><a href='#!'>Changelog</a></li>
              </ul>
            </div>
          </nav>

          <ul id='mobile-nav' className='sidenav'>
            <li className={this.getNavLinkClass('/')}><NavLink to='/' exact className='sidenav-close' activeClassName='active'>Cosplay Grid</NavLink></li>
            <li className={this.getNavLinkClass('/all-cosplays')}><NavLink to='/all-cosplays' className='sidenav-close' activeClassName='active'>All Cosplays</NavLink></li>
          </ul>
        </div>

        <Modal id='changelog-modal'>
          <Changelog />
        </Modal>
      </>
    )
  }
}

export default withRouter(Navbar)
