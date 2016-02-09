import Battery from './battery'

const controllers = {
  'battery': Battery
}

module.exports = function (req, reply) {
  const obj = req.payload.object
  const method = req.payload.method

  controllers[obj][method](req, reply)
}
