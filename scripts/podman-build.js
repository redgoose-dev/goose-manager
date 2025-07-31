import { DOCKER_IMAGE, run } from './assets.js'
import pkg from '../package.json'

const version = pkg.version

// actions
await run([
  'podman',
  'build',
  '--force-rm',
  '--no-cache',
  '-t',
  `${DOCKER_IMAGE}:latest`,
  '.'
])
await run([
  'podman',
  'tag',
  `${DOCKER_IMAGE}:latest`,
  `${DOCKER_IMAGE}:${version}`,
])
await run([ 'podman', 'image', 'prune', '-f' ])
