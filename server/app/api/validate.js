import Joi from 'joi'
import _ from 'lodash'

import whitelist from './whitelist.json'

const objects = Object.keys(whitelist)

// Generate the list of alternatives based on the whitelist
// for the `method` field in the payload.
const methods = () => _.map(objects, obj => Joi.string().required()
  .when('object', {
    is: obj,
    then: Joi.valid(whitelist[obj]),
    otherwise: Joi.forbidden()
  }))

export default {objects, methods}
