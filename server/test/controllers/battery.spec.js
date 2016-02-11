import _ from 'lodash'
import Promise from 'bluebird'
import proxyquire from 'proxyquire'

const BatteryModel = {}
const logger = {}

const yearsDBData = [
  {'_id': 2015, 'months': [12, 11, 8]},
  {'_id': 2014, 'months': [6, 3]},
  {'_id': 2013, 'months': [5, 4, 1]}
]

const resetModels = () => {
  BatteryModel.aggregateAsync = sinon.stub().returns(Promise.resolve(yearsDBData))
  BatteryModel.findOneAsync = sinon.stub().returns(Promise.resolve(null))
  BatteryModel.createAsync = sinon.stub()
  BatteryModel.findAsync = sinon.stub().returns(Promise.resolve(['data']))

  logger.error = sinon.stub()
}

const DELAY = 100

const resetStubSetTimeout = run => {
  setTimeout.restore && setTimeout.restore()
  const origSetTimeout = setTimeout
  sinon.stub(global, 'setTimeout', (f, t) => {
    if (run) {
      origSetTimeout(f, DELAY)
    }
  })
}

const getProxy = () => proxyquire('../../app/controllers/battery', {
  '../models/battery': BatteryModel,
  '../lib/logger': logger
})

describe('battery', () => {
  let Battery
  let reply

  beforeEach(() => {
    proxyquire.noCallThru()
    resetStubSetTimeout(false)
    reply = sinon.spy()
    resetModels()
    Battery = getProxy()
  })

  afterEach(() => {
    setTimeout.restore()
    proxyquire.callThru()
  })

  it('getYears', done => {
    reply = (result) => {
      expect(_.isEqual(result['2013'], [5, 4, 1])).to.be.true
      expect(_.isEqual(result['2014'], [6, 3])).to.be.true
      expect(_.isEqual(result['2015'], [12, 11, 8])).to.be.true
      done()
    }
    Battery.getYears(null, reply)
  })

  it('getInfoByYearMonth', () => {
    const year = 2015
    const month = 6
    const req = {
      payload: {
        data: {year, month}
      }
    }
    Battery.getInfoByYearMonth(req, reply)
    return defer(() => {
      expect(BatteryModel.findAsync).to.have.been.calledWith({year, month})
      expect(reply).to.have.been.calledWith(['data'])
    })
  })

  it('setLow inserts new data', done => {
    const date = new Date()
    const level = 25
    const timestamp = date.getTime()

    const year = '' + date.getUTCFullYear()
    const month = '' + (date.getUTCMonth() + 1)
    const day = '' + date.getUTCDate()

    const req = {
      payload: {
        data: {level, timestamp}
      }
    }

    BatteryModel.createAsync = arg => {
      expect(arg.year).to.be.equal(year)
      expect(arg.month).to.be.equal(month)
      expect(arg.day).to.be.equal(day)
      expect(arg.averageLevel).to.be.equal(25)
      expect(arg.totalRequests).to.be.equal(1)
      expect(reply).to.have.been.calledWith()
      done()
    }

    resetStubSetTimeout(true)
    Battery = getProxy()
    Battery.setLow(req, reply)
  })

  it('setLow returns error', done => {
    const date = new Date()
    const level = 25
    const timestamp = date.getTime()

    const req = {
      payload: {
        data: {level, timestamp}
      }
    }
    const errorMsg = 'This is a error message'
    BatteryModel.createAsync.returns(Promise.reject(new Error(errorMsg)))
    resetStubSetTimeout(true)
    Battery = getProxy()

    logger.error = (msg) => {
      expect(reply).to.have.been.calledWith()
      expect(msg).to.be.equal(errorMsg)
      done()
    }

    Battery.setLow(req, reply)
  })

  it('setLow updates data', done => {
    const date = new Date()
    const level = 25
    const timestamp = date.getTime()

    const year = '' + date.getUTCFullYear()
    const month = '' + (date.getUTCMonth() + 1)
    const day = '' + date.getUTCDate()

    const req = {
      payload: {
        data: {level, timestamp}
      }
    }

    const modelData = {
      year, month, day, averageLevel: 32.5, totalRequests: 2,
      saveAsync() {
        expect(BatteryModel.createAsync).to.not.have.been.called
        expect(this.totalRequests).to.be.equal(4)
        expect(this.averageLevel).to.be.equal(28.75)
        expect(reply).to.have.been.calledWith()
        done()
      }
    }

    BatteryModel.findOneAsync.returns(Promise.resolve(modelData))

    resetStubSetTimeout(true)
    Battery = getProxy()
    Battery.setLow(req, reply)
    Battery.setLow(req, reply)
  })
})
