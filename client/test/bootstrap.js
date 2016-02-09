// test/bootstrap.js
// Put this in your test directory and smoke it
// (include it with your tests or test recursively)

// globals
// -------

global.sinon = require('sinon')
global.jsdom = require('jsdom').jsdom(
  '<!doctype html><html><body><main id="b2m"></main></body></html>',
  {
    url: 'http://localhost'
  }
)
global.document = jsdom
global.document.documentElement.clientHeight = 500
global.window = document.parentWindow
global.navigator = window.navigator
global.location = window.location
global.HTMLElement = function () {}
global.nock = require('nock')

global._ = require('lodash')
const React = global.React = require('react/addons')
global.TestUtils = React.addons.TestUtils
global.$R = require('rquery')(global._, React)
global.chai = require('chai')
global.chai.use(function (chai, utils) {
  require('chai-react')(chai, utils, React)
})
global.chai.use(require('sinon-chai'))
global.chai.use(require('chai-immutable'))
global.expect = global.chai.expect

global.reactStub = React.createClass({
  displayName: 'StubClass',
  render() {
    return null
  }
})

// Load Helpers
global.stubRouter = require('./test-helpers/stub-router-context')
global.defer = require('./test-helpers/defer')

// HACK: prevent test loading failing
// during clipboard package usage tests not starting because of matches-selector package
const ElementProto = {
  matchesSelector: null,
  webkitMatchesSelector: null,
  mozMatchesSelector: null,
  msMatchesSelector: null,
  oMatchesSelector: null
}
global.Element = {}
global.Element.prototype = ElementProto

require('bluebird').longStackTraces()

// Make bluebird less noisy in the test output
process.on('unhandledRejection', (reason, promise) => {})

process.on('rejectionHandled', promise => {})

// Setup
// -----

before(() => {
  nock.enableNetConnect(/^localhost/)
})

beforeEach(() => {

})

// teardown
afterEach(() => {
  nock.cleanAll()
})

after(() => {
  nock.restore()
})
