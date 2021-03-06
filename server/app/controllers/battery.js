import {Promise} from 'bluebird'
import _ from 'lodash'
import logger from '../lib/logger'
import Battery from '../models/battery'

const STORE_CACHE_TIMEOUT = 1000

const ctrl = {}
let cache = {}

const setCache = (year, month, day, level) => {
  if (!_.has(cache, year)) {
    cache[year] = {}
  }
  if (!_.has(cache[year], month)) {
    cache[year][month] = {}
  }
  if (!_.has(cache[year][month], day)) {
    cache[year][month][day] = {
      averageLevel: level,
      totalRequests: 1
    }
  } else {
    const dayObj = cache[year][month][day]
    const newTotalRequest = dayObj.totalRequests + 1
    dayObj.averageLevel = ((dayObj.averageLevel * dayObj.totalRequests) + level) / (newTotalRequest)
    dayObj.totalRequests = newTotalRequest
    cache[year][month][day] = dayObj
  }
}

const clearCache = () => {
  const updatesP = []
  if (!_.isEmpty(cache)) {
    const shallow = _.clone(cache)
    cache = {}
    _.map(shallow, (v, year) => {
      _.map(shallow[year], (v, month) => {
        _.map(shallow[year][month], (v, day) => {
          const info = shallow[year][month][day]
          updatesP.push(updateDB(year, month, day, info.averageLevel, info.totalRequests))
        })
      })
    })
  }
  Promise.all(updatesP)
  .catch(({message}) => {
    logger.error(message)
  })
  .finally(() => clearCacheCycle())
}

const clearCacheCycle = () => setTimeout(clearCache, STORE_CACHE_TIMEOUT)

const fixAverage = num => parseFloat(num.toFixed(2))

const updateDB = (year, month, day, averageLevel, totalRequests) => {
  return Battery.findOneAsync({year, month, day})
  .then(stats => {
    if (stats === null) {
      return Battery.createAsync({
        year, month, day, totalRequests,
        averageLevel: fixAverage(averageLevel)
      })
    }
    const newTotalReqs = stats.totalRequests + totalRequests
    const oldLevel = stats.averageLevel * stats.totalRequests
    const newLevel = averageLevel * totalRequests
    const newAverage = (oldLevel + newLevel) / newTotalReqs
    stats.averageLevel = fixAverage(newAverage)
    stats.totalRequests = newTotalReqs
    return stats.saveAsync()
  })
}

ctrl.setLow = (req, reply) => {
  const {level, timestamp} = req.payload.data
  const date = new Date(timestamp)

  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  setCache(year, month, day, level)
  reply()
}

ctrl.getInfoByYearMonth = (req, reply) => {
  const {year, month} = req.payload.data

  Battery.findAsync({year, month})
  .then(reply)
  .catch(reply)
}

ctrl.getYears = (req, reply) => {
  Battery.aggregateAsync([{'$group': {
    '_id': '$year',
    'months': {$addToSet: '$month'}
  }}])
  .then(info => {
    const result = {}
    _.forEach(info, data => {
      result[data['_id']] = data['months']
    })
    return result
  })
  .then(reply)
  .catch(reply)
}

clearCacheCycle()
export default ctrl
