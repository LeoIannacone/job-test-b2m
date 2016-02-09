import Reflux from 'reflux'
import BatteryManager from '../helpers/api/battery-manager'

export default Reflux.createStore({

  getYears: () => {
    return BatteryManager.getYears()
  },

  getInfoByYearMonth: (year, month) => {
    return BatteryManager.getInfoByYearMonth(year, month)
  }
})
