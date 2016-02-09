// Helps with testing components that contain react-router's Link component.
// See https://github.com/rackt/react-router/blob/master/docs/guides/testing.md

import React from 'react'
import _ from 'lodash'
const {func, number} = React.PropTypes

export default (Component, props = {}, stubs = {}) => {
  function RouterStub() {}

  _.assign(RouterStub, {
    makePath() {},
    makeHref() {},
    transitionTo() {},
    replaceWith() {},
    goBack() {},
    getCurrentPath() {},
    getCurrentRoutes() {},
    getCurrentPathname() {},
    getCurrentParams() { return {} },
    getCurrentQuery() { return {} },
    isActive() {},
    getRouteAtDepth() {},
    setRouteComponentAtDepth() {}
  }, stubs)

  return React.createClass({
    displayName: 'stub-router-context',

    childContextTypes: {
      router: func,
      routeDepth: number
    },

    getChildContext() {
      return {
        router: RouterStub,
        routeDepth: 0
      }
    },

    render() {
      _.assign(this.props, props)
      return (
          <Component {...this.props}/>
      )
    }
  })
}
