import React from 'react'

import BatteryStore from '../../stores/battery-store'

import SimpleTabber from '../../components/simple-tabber'

import Year from './year'

export default React.createClass({
  displayName: 'BatteryMain',

  getInitialState() {
    return {
      years: null
    }
  },

  componentWillMount() {
    BatteryStore.getYears()
    .then(years => {
      years = years.reverse()
      if (this.isMounted()) {
        this.setState({years})
      }
    })
  },

  render() {
    const {years} = this.state
    if (years === null) {
      return null
    }

    const tabs = years.map((months, year) => {
      return (
        <Year
          year={year}
          months={months}
          tabKey={'' + year}
          tabTitle={year}
          key={year}
        />
      )
    })

    return (
      <div className="battery">
        <div className='battery-tabs'>
          <SimpleTabber defaultTabKey={'' + years.first()}>
            {tabs}
          </SimpleTabber>
        </div>
      </div>
    )
  }
})
