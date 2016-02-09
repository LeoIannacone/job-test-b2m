import helper from '../../stores/helpers/battery'
import baseRequest from './base'

const request = (method, data) => baseRequest('battery', method, data)

export default {
  getYears: () => {
    return request('getYears')
  },

  getInfoByYearMonth: (year, month) => {
    return request('getInfoByYearMonth', {year, month})
    .then(data => data.map(helper.getStatsFromData))
  }
}
