import Promise from 'bluebird'
import proxyquire from 'proxyquire'

const BatteryModel = {}

const resetModels = () => {
  BatteryModel.distinctAsync = sinon.stub().returns(Promise.resolve([2012, 2013]))
  BatteryModel.findOneAsync = sinon.stub().returns(Promise.resolve(null))
  BatteryModel.createAsync = sinon.stub()
  BatteryModel.findAsync = sinon.stub().returns(Promise.resolve(['data']))
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
  '../models/battery': BatteryModel
})

describe('battery', () => {
  let Battery
  let reply

  beforeEach(() => {
    proxyquire.noCallThru()
    resetStubSetTimeout(false)
    reply = sinon.stub()
    resetModels()
    Battery = getProxy()
  })

  afterEach(() => {
    setTimeout.restore()
    proxyquire.callThru()
  })

  it('getYears', () => {
    Battery.getYears(null, reply)
    return defer(() => {
      expect(reply).to.have.been.calledWith([2012, 2013])
    })
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

  it('setLow inserts new data', () => {
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
    resetStubSetTimeout(true)
    Battery = getProxy()
    Battery.setLow(req, reply)
    return Promise.delay(DELAY)
    .then(() => {
      expect(BatteryModel.createAsync).to.have.been.calledWith({
        year, month, day, averageLevel: 25, totalRequests: 1
      })
    })
  })

  it('setLow updates data', () => {
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
      saveAsync: sinon.stub()
    }

    BatteryModel.findOneAsync.returns(Promise.resolve(modelData))

    resetStubSetTimeout(true)
    Battery = getProxy()
    Battery.setLow(req, reply)
    return Promise.delay(DELAY)
    .then(() => {
      expect(BatteryModel.createAsync).to.not.have.been.called
      expect(modelData.saveAsync).to.have.been.called
      expect(modelData.totalRequests).to.be.equal(3)
      expect(modelData.averageLevel).to.be.equal(30)
    })
  })
})
