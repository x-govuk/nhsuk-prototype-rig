#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import commonJs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import chokidar from 'chokidar'
import copy from 'rollup-plugin-copy'
import { rollup, watch } from 'rollup'
import * as sass from 'sass'
import { browserSyncConfig } from '../lib/browser-sync.js'
import { findAvailablePort, getEnv } from '../lib/environment.js'
import app from '../lib/server.js'

// Environment
const env = getEnv()
const isProduction = env === 'production'

// Rollup
const inputOptions = {
  input: ['app/assets/javascripts/application.js'],
  plugins: [
    copy({
      targets: [
        {
          src: 'app/assets/!(javascripts|stylesheets)',
          dest: 'public'
        }
      ]
    }),
    nodeResolve(), // Resolve modules imported from node_modules
    commonJs() // Convert CommonJS modules to ES6
  ]
}

const outputOptions = {
  dir: 'public',
  sourcemap: true
}

async function createPublicFolder() {
  try {
    await fs.mkdir('public', { recursive: true })
  } catch (error) {
    console.error(error)
  }
}

async function compileJs() {
  try {
    const bundle = await rollup(inputOptions)

    const { output } = await bundle.generate(outputOptions)

    for (const chunkOrAsset of output) {
      const filePath = path.join('public', chunkOrAsset.fileName)
      if (chunkOrAsset.type === 'asset') {
        await fs.writeFile(filePath, chunkOrAsset.source)
      } else {
        await fs.writeFile(filePath, chunkOrAsset.code)
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function watchJs() {
  const watcher = watch({
    ...inputOptions,
    output: [outputOptions]
  })

  watcher.on('change', async (path, result) => {
    console.info(`File ${path} has been changed`)
    await compileJs()

    if (result) {
      result.close()
    }
  })
}

async function compileScss() {
  try {
    const result = sass.compile('app/assets/stylesheets/application.scss', {
      loadPaths: ['.', 'node_modules'],
      style: 'compressed',
      silenceDeprecations: ['import', 'mixed-decls'],
      sourceMap: true,
      sourceMapIncludeSources: true,
      outFile: 'public/application.css',
      quietDeps: true
    })

    await fs.writeFile('public/application.css', result.css)
    await fs.writeFile(
      'public/application.css.map',
      JSON.stringify(result.sourceMap, null, 0)
    )
  } catch (error) {
    console.error(error)
  }
}

async function watchScss() {
  const watcher = chokidar.watch('**/*.scss', {
    ignored: 'node_modules',
    persistent: true
  })

  watcher.on('change', async (path) => {
    console.info(`File ${path} has been changed`)
    await compileScss()
  })
}

await createPublicFolder()
await compileJs()
await compileScss()

if (!isProduction) {
  await watchJs()
  await watchScss()
}

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
