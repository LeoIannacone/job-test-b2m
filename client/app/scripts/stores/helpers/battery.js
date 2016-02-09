import BatteryStats from './../definitions/battery-stats'

export default {
  getStatsFromData: data => {
    return new BatteryStats({
      year: data.get('year'),
      month: data.get('month'),
      day: data.get('day'),
      totalRequests: data.get('totalRequests'),
      averageLevel: data.get('averageLevel')
    })
  }
}
