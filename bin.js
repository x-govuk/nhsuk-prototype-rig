#!/usr/bin/env node
import nodemon from 'nodemon'

nodemon({
  script: './node_modules/nhsuk-prototype-rig/lib/server.js',
  watch: ['.env', '**/*.js', '**/*.json'],
  ignore: ['public/*', 'app/assets/*', 'node_modules/*', 'package/*']
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
