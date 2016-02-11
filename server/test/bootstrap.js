// // test/bootstrap.js
// // Put this in your test directory and smoke it
// // (include it with your tests or test recursively)

// // globals
// // -------

global.sinon = require('sinon')
global.chai = require('chai')
global.chai.use(require('sinon-chai'))
global.expect = global.chai.expect

global.defer = require('./test-helpers/defer')
