import Reflux from 'reflux'
import Bluebird from 'bluebird'

export default () => {
  Reflux.setPromise(Bluebird)
}
