import fs from 'node:fs'
import process from 'node:process'

import { confirm } from '@inquirer/prompts'
import _ from 'lodash'
import portScanner from 'portscanner'

/**
 * Get environment name
 *
 * @returns {string} Environment name
 */
export const getEnv = () => {
  // glitch.com
  const glitchEnv = process.env.PROJECT_REMIX_CHAIN ? 'production' : false

  return process.env.NODE_ENV || glitchEnv || 'development'
}

/**
 * Get environment variable as a boolean value, defaulting to value
 * in configuration
 *
 * @example "true" => true
 * @example "TRUE" => true
 * @example "false" => false
 * @example "foo" => false
 * @param {object|Array} name - Name of variable
 * @param {object} config - Package configuration
 * @returns {boolean} Returns `true` if `name` evaluates to true
 */
export const getEnvBoolean = (name, config) => {
  let value
  if (config) {
    value = process.env[name] || config[_.camelCase(name)]
  } else {
    value = process.env[name]
  }

  return String(value).toLowerCase() === 'true'
}

/**
 * Find an available port to run the server on
 *
 * @param {Function} callback - Callback
 */
export function findAvailablePort(callback) {
  let port = null
  const tmpFile = new URL('../.port.tmp', import.meta.url).pathname

  // When the server starts, we store the port in .port.tmp so it tries to
  // restart on the same port
  try {
    port = Number(fs.readFileSync(tmpFile))
  } catch (error) {
    port = Number(process.env.PORT || 3000)
  }

  console.log('')

  // Check port is free, else offer to change
  portScanner.findAPortNotInUse(
    port,
    port + 50,
    '127.0.0.1',
    async (error, availablePort) => {
      if (error) {
        throw error
      }

      if (port === availablePort) {
        // Port is free, return it via the callback
        callback(port)
      } else {
        // Port in use - offer to change to available port
        console.error(
          `ERROR: Port ${port} in use - you may have another prototype running.\n`
        )

        // Ask user if they want to change port
        const answer = await confirm({
          message: 'Change to an available port?'
        })

        if (answer === true) {
          // User answers yes
          port = availablePort
          fs.writeFileSync(tmpFile, port.toString())
          console.info(`Changed to port ${port}`)

          callback(port)
        } else {
          // User answers no - exit
          console.info(
            '\nYou can set a new default port in server.js, or by running the server with PORT=XXXX'
          )
          console.info('\nExit by pressing ‘ctrl + c’')
          process.exit(0)
        }
      }
    }
  )
}
