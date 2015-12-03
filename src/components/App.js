import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('styles/main.scss')
}

import Nav from 'components/Nav'

class App extends Component {

  render () {

    return (
      <div className='brand'>

        <header>

          <h1>{'minus'}</h1>
          <em>{'Minimalist starter for universal apps'}</em>

        </header>

        <Nav />

        {this.props.children}

        <footer>
          <em>{'No fucking copyright. '}</em>
          <a target='_blank' href='https://github.com/SIGSEV/minus'>Code is on Github</a>
        </footer>

      </div>
    )
  }
}

export default App
