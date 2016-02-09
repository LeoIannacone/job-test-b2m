import Battery from './battery'

const controllers = {
  'battery': Battery
}

export default (req, reply) => {
  const obj = req.payload.object
  const method = req.payload.method

  return controllers[obj][method](req)
}
