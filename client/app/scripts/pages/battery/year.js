import I from 'immutable'
import React from 'react'

import Menu from './menu'
import Stats from './stats'

export default React.createClass({
  displayName: 'BatteryYear',

  propTypes: {
    year: React.PropTypes.string.isRequired,
    months: React.PropTypes.instanceOf(I.List).isRequired
  },

  getInitialState() {
    return {
      selectedMonth: this.props.months.sort().get(0)
    }
  },

  _onMonthSelect(selectedMonth) {
    this.isMounted() && this.setState({selectedMonth})
  },

  render() {
    const {year, months} = this.props
    const {selectedMonth} = this.state
    return (
      <div className='batteryYear'>
        <Menu onSelect={this._onMonthSelect} months={months} selectedMonth={selectedMonth} />
        <Stats year={year} month={selectedMonth} />
      </div>
    )
  }
})
