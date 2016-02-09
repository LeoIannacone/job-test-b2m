import Joi from 'joi'

exports.setLow = Joi.object().keys({
  timestamp: Joi.number().required(),
  deviceId: Joi.string().required(),
  level: Joi.number().min(0).max(100)
})

exports.getInfoByYearMonth = Joi.object().keys({
  year: Joi.number().required(),
  month: Joi.string().required()
})

exports.getYears = Joi.object()
