import Promise from 'bluebird'
import Hapi from 'hapi'
import mongoose from 'mongoose'
import MongooseAggregate from 'mongoose/lib/aggregate'
import uuid from 'node-uuid'

import routes from './routes'
import config from '../config.json'

function responseTransform(req, reply) {
  var response = req.response

  // Normal response
  if (!response.isBoom) {
    return reply({
      code: 1,
      response: response.source
    })
  }

  // Error handling
  var error = response
  if (error.output.statusCode >= 500) {
    var id = uuid.v1()
    error.message += ' - ' + id
    error.id = id
  }

  req.log(['error'], error)
  console.error(error.stack)

  reply({
    code: 0,
    message: error.message
  })
}

const handleErr = ({message}) => console.error(message)

Promise.promisifyAll(mongoose)
Promise.promisifyAll(MongooseAggregate.prototype)

const server = Promise.promisifyAll(new Hapi.Server())
server.connection({port: config.port, host: config.host})

server.route(routes)

server.ext('onPreResponse', responseTransform)


mongoose.connectAsync(config.mongo.uri, config.mongo.options)
.catch(handleErr)

server.startAsync()
.then(() => console.log(`Server running at ${server.info.uri}`))
.catch(handleErr)

