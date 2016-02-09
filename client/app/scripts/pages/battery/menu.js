import I from 'immutable'
import React from 'react'
import classnames from 'classnames'
import moment from 'moment'

export default React.createClass({
  displayName: 'BatteryMenu',

  propTypes: {
    selectedMonth: React.PropTypes.number,
    months: React.PropTypes.instanceOf(I.List).isRequired,
    onSelect: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      selectedMonth: 1,
      onSelect: () => {}
    }
  },

  _onClick(ev) {
    this.props.onSelect(parseInt(ev.target.getAttribute('data-month'), 10))
  },

  render() {
    const {selectedMonth, months} = this.props
    const children = months.sort().map(month => {
      const className = classnames('batteryMenu-elem', {
        'is-active': month === selectedMonth
      })
      return (
        <li className={className} data-month={month} onClick={this._onClick} key={month}>
          {moment.months()[month - 1]}
        </li>
      )
    })
    return (
      <div className='batteryMenu'>
        <ul className="batteryMenu-list">
          {children}
        </ul>
      </div>
    )
  }
})
