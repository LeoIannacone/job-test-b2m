import React from 'react'
import ReactRouter from 'react-router'

const RouteHandler = ReactRouter.RouteHandler

export default React.createClass({
  displayName: 'App',

  render() {
    return (
      <div className='app'>
        <main>
          <RouteHandler />
        </main>
      </div>
    )
  }
})
