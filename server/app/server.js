import Promise from 'bluebird'
import Hapi from 'hapi'
import mongoose from 'mongoose'
import MongooseAggregate from 'mongoose/lib/aggregate'

import routes from './routes'
import config from '../config.json'

const handleErr = ({message}) => console.error(message)

Promise.promisifyAll(mongoose)
Promise.promisifyAll(MongooseAggregate.prototype)

const server = Promise.promisifyAll(new Hapi.Server())
server.connection({port: config.port, host: config.host})

server.route(routes)

mongoose.connectAsync(config.mongo.uri, config.mongo.options)
.catch(handleErr)

server.startAsync()
.then(() => console.log(`Server running at ${server.info.uri}`))
.catch(handleErr)

