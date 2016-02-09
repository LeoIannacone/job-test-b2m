// Dependencies

import Joi from 'joi'

import validator from '../../app/api/validate'

describe('validator', () => {
  describe('methods', () => {
    it('rejects non listed method', () => {
      Joi.validate({
        object: 'battery',
        method: 'not_exists'
      }, Joi.object().keys({
        object: Joi.string(),
        method: validator.methods()
      }), ({message}) => {
        expect(message).to.match(
          /"method" must be one of /
        )
      })
    })
  })
})
