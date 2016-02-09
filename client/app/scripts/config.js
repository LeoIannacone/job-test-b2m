import config from '../config'
import Immutable from 'immutable'

const ConfigRecord = Immutable.Record(config)

export default new ConfigRecord()
