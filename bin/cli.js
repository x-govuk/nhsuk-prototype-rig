#!/usr/bin/env node
import process from 'node:process'

import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

import { browserSyncConfig } from '../lib/browser-sync.js'
import { findAvailablePort } from '../lib/environment.js'
import app from '../lib/server.js'

// Arguments
const args = process.argv.slice(2)
const watchMode = args.includes('--watch')

async function compileAssets() {
  const options = {
    entryPoints: [
      'app/assets/javascripts/application.js',
      'app/assets/stylesheets/application.scss'
    ],
    entryNames: '[name]',
    bundle: true,
    legalComments: 'none',
    minify: true,
    outdir: 'public',
    plugins: [
      sassPlugin({
        loadPaths: ['.', 'node_modules'],
        silenceDeprecations: ['import', 'mixed-decls'],
        quietDeps: true
      })
    ],
    sourcemap: true
  }

  try {
    if (watchMode) {
      const ctx = await esbuild.context(options)
      await ctx.watch()
    } else {
      await esbuild.build(options)
    }
  } catch (error) {
    console.error(error)
  }
}

findAvailablePort(async (port) => {
  if (watchMode) {
    const proxyPort = port - 50
    app.listen(proxyPort, () => browserSyncConfig(app, port, proxyPort))
    await compileAssets()
  } else {
    await compileAssets()
    console.info(`Listening on port ${port}`)
    app.listen(port)
  }
})
