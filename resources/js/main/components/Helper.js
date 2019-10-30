import React, { Component } from 'react'

class Helper extends Component {
  static checkLocalStorage () {
    const test = 'test'
    try {
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }

  static checkSessionStorage () {
    const test = 'test'
    try {
      sessionStorage.setItem(test, test)
      sessionStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }

  static setToken (data) {
    if (this.checkLocalStorage()) {
      localStorage.setItem('token', data)
      return true
    } else if (this.checkSessionStorage()) {
      sessionStorage.setItem('token', data)
      return true
    } else {
      return false
    }
  }

  static getToken () {
    if (this.checkLocalStorage()) {
      return localStorage.getItem('token')
    } else if (this.checkSessionStorage()) {
      return sessionStorage.getItem('token')
    } else {
      return null
    }
  }

  static removeToken () {
    if (this.checkLocalStorage()) {
      localStorage.removeItem('token')
    }

    if (this.checkSessionStorage()) {
      sessionStorage.removeItem('token')
    }
  }
}

export default Helper
