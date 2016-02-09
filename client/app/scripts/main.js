import React from 'react'
import Router from 'react-router'
import routes from'./routes'

import setup from './setup'

setup()

const ElementToRender = React.createClass({
  displayName: 'Main',

  propTypes: {
    handler: React.PropTypes.any,
    routeState: React.PropTypes.object
  },

  render() {
    const Handler = this.props.handler
    return (
      <div className='main'>
        <Handler />
      </div>
    )
  }
})

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(
    <ElementToRender handler={ Handler } routeState={state}/>, document.getElementById('b2m')
  )
})
