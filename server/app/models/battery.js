import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  averageLevel: {
    type: Number,
    required: true
  },
  totalRequests: {
    type: Number,
    require: true
  }
})

schema.index({year: 1, month: 1, day: 1}, {unique: true})
schema.set('toJSON', {virtuals: true})
schema.set('toObject', {virtuals: true})

module.exports = mongoose.model('battery', schema)
