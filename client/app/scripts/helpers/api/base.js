import I from 'immutable'
import makeRequest from 'superagent-bluebird-promise'

import config from '../../config'

const {serverUrl} = config

export default (object, method, data) => {
  const params = {object, method, data}
  return makeRequest
  .post(serverUrl)
  .send(params)
  .then(res => {
    const body = res.body
    if (body.code !== 1) {
      return Promise.reject(body)
    }
    return I.fromJS(body.response)
  })
}
