import Joi from 'joi'

import validateController from '../lib/validate-controller'
import validatePayload from '../pre/validate-payload'
import controller from '../controllers'

const routes = []

routes.push({
  method: 'POST',
  path: '/api',
  config: {
    cors: true,
    pre: [
      { method: validatePayload, assign: 'data' }
    ],
    handler: controller,
    validate: {
      payload: Joi.object().keys({
        object: Joi.string().required().valid(validateController.objects),
        method: validateController.methods(),
        data: Joi.object().optional()
      })
    }
  }
})

module.exports = routes
