import Joi from 'joi'

import validateApi from '../api/validate'
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
        object: Joi.string().required().valid(validateApi.objects),
        method: validateApi.methods(),
        data: Joi.object().optional()
      })
    }
  }
})

export default routes
