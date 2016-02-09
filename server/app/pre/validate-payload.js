import Joi from 'joi'

import schemas from '../api/schemas'

// Validate the given data by the schema
//
// value  - Mixed,
// schema - Joi Schema
//
// Returns a promise.
const validate = (value, schema) => Promise.resolve(Joi.validate(value, schema, {
  convert: true
}))

// Fetch the schema from the configuration
//
// object - String
// method - String
//
// Returns a Joi schema object.
const getSchema = (object, method) => schemas[object][method]

module.exports = (req, reply) => {
  const schema = getSchema(req.payload.object, req.payload.method)

  validate(req.payload.data, schema)
  .then(reply)
  .catch(reply)
}
