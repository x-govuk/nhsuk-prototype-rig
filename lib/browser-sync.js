import browserSync from 'browser-sync'

/**
 * Get Browsersync config
 *
 * @param {object} server - Server config
 * @param {number} port - Port
 * @param {number} proxyPort - Proxy port
 */
export function browserSyncConfig(server, port, proxyPort) {
  browserSync({
    proxy: `localhost:${proxyPort}`,
    port,
    files: ['assets/**/*', 'app/**/*'],
    logPrefix: server.locals.serviceName,
    ghostMode: false,
    open: false,
    notify: false,
    ui: false
  })
}
