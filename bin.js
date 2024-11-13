#!/usr/bin/env node
import { browserSyncConfig } from './lib/browser-sync.js'
import { findAvailablePort, getEnv } from './lib/environment.js'
import app from './lib/server.js'

findAvailablePort((port) => {
  const isProduction = getEnv() === 'production'
  if (isProduction) {
    console.info(`Listening on port ${port}`)
    app.listen(port)
  } else {
    const proxyPort = port - 50
    app.listen(proxyPort, () => browserSyncConfig(app, port, proxyPort))
  }
})
