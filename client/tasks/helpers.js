import {join} from 'path'
import {readFileSync} from 'fs'

import {dist} from './config'

function readManifest(name) {
  return JSON.parse(readFileSync(join(dist, `${name}.json`)))
}

export function loadManifests(list) {
  const manifest = {}
  list.forEach(name => {
    Object.assign(manifest, readManifest(name))
  })

  return manifest
}
