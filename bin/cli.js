#!/usr/bin/env node
import nodemon from 'nodemon'

nodemon({
  script: './node_modules/nhsuk-prototype-rig/lib/server.js',
  ignore: ['assets/*', 'app/assets/*', 'node_modules/*']
})

let ignoreExit = false

nodemon.on('restart', () => {
  ignoreExit = true
})

nodemon.on('exit', () => {
  if (ignoreExit) {
    ignoreExit = false
    return
  }
  process.exit()
})
