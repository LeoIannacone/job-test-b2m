import React from 'react'
import ImmutableRenderMixin from 'react-immutable-render-mixin'
import Tabs from 'react-simpletabs'
import classnames from 'classnames'

export default React.createClass({
  displayName: 'SimpleTabber',

  propTypes: {
    defaultTabKey: React.PropTypes.string.isRequired,
    onTabChange: React.PropTypes.func,
    className: React.PropTypes.string
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: {
    ImmutableRenderMixin
  },

  getDefaultProps() {
    return {
      onTabChange: () => {},
      className: null
    }
  },

  getInitialState() {
    this._collectTabKeys()

    const query = this.context.router.getCurrentQuery()
    return {
      tabKey: query.tab || this.props.defaultTabKey
    }
  },

  componentWillReceiveProps() {
    this._collectTabKeys()

    const query = this.context.router.getCurrentQuery()
    this.setState({
      tabKey: query.tab || this.props.defaultTabKey
    })
  },

  _collectTabKeys() {
    this.tabKeys = []

    React.Children.forEach(this.props.children, child => {
      if (child && child.props.tabKey) {
        this.tabKeys.push(child.props.tabKey)
      }
    })
  },

  _onTabChange(index, updateRouter) {
    const {router} = this.context

    const query = router.getCurrentQuery()
    const newTabKey = this.tabKeys[index - 1]
    query.tab = newTabKey

    updateRouter(router.getCurrentPathname(), router.getCurrentParams(), query)

    this.setState({tabKey: newTabKey})
    this.props.onTabChange(index)
  },

  _onTabsMount(index) {
    // Use replaceWith only on first call
    this._onTabChange(index, this.context.router.replaceWith)
  },

  _onBeforeChange(index) {
    this._onTabChange(index, this.context.router.transitionTo)
  },

  _getTabIndexByKey(value) {
    const index = this.tabKeys.indexOf(value)
    return index > -1 ? (index + 1) : 1
  },

  _wrapChildren() {
    this.routes = []
    // wrap children in Tabs.Panel
    return React.Children.map(
      this.props.children, (element) => {
        const {tabKey, tabTitle} = element.props
        return (
          <Tabs.Panel
            key={tabKey}
            title={tabTitle}
            className='simpleTabber-panel'
            >
            {element}
          </Tabs.Panel>
        )
      }
    )
  },

  render() {
    const children = this._wrapChildren()
    const index = this._getTabIndexByKey(this.state.tabKey)
    const className = classnames('simpleTabber', this.props.className)
    return (
      <Tabs
        className={className}
        tabActive={index}
        onMount={this._onTabsMount}
        onBeforeChange={this._onBeforeChange}
        >
      {children}
      </Tabs>
    )
  }
})
