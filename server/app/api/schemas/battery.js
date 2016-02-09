import Joi from 'joi'

export const setLow = Joi.object().keys({
  timestamp: Joi.number().required(),
  deviceId: Joi.string().required(),
  level: Joi.number().min(0).max(100)
})

export const getInfoByYearMonth = Joi.object().keys({
  year: Joi.number().required(),
  month: Joi.string().required()
})

export const getYears = Joi.object()
