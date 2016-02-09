import React from 'react'
import Chartist from 'chartist'

import BatteryStore from '../../stores/battery-store'

export default React.createClass({
  displayName: 'BatteryStats',

  propTypes: {
    year: React.PropTypes.string.isRequired,
    month: React.PropTypes.number.isRequired
  },

  componentWillMount() {
    const {year, month} = this.props
    this._fetchData(year, month)
  },

  componentWillReceiveProps(newProps) {
    const {year, month} = newProps
    this._fetchData(year, month)
  },

  _updateChartAverage(stats) {
    const data = {
      labels: [],
      series: [[]]
    }
    stats.forEach(stat => {
      data.labels.push(stat.day)
      data.series[0].push(stat.averageLevel)
    })
    return new Chartist.Line('.batteryStats-average', data)
  },

  _updateChartRequests(stats) {
    const data = {
      labels: [],
      series: [[]],
      fullWidth: true,
      chartPadding: {
        right: 40
      }
    }

    stats.forEach(stat => {
      data.labels.push(stat.day)
      data.series[0].push(stat.totalRequests)
    })

    return new Chartist.Bar('.batteryStats-requests', data)
  },

  _fetchData(year, month) {
    BatteryStore.getInfoByYearMonth(year, month)
    .then(stats => {
      if (this.isMounted()) {
        this._updateChartRequests(stats)
        this._updateChartAverage(stats)
      }
    })
  },

  render() {
    return (
      <div className='batteryStats'>
        <h2>Average Level</h2>
        <div className='batteryStats-average' />
        <h2>Total Requests</h2>
        <div className='batteryStats-requests' />
      </div>
    )
  }
})
