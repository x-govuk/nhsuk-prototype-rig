import path from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * @access private
 * @param {object} input - Original data
 * @param {object} data - Data to update
 */
const _storeData = (input, data) => {
  for (const i in input) {
    let validInput = true

    // Prevent prototype pollution
    if (!Object.prototype.hasOwnProperty.call(input, i)) {
      validInput = false
    }

    if (i === '__proto__' || i === 'constructor') {
      validInput = false
    }

    // Any input where the name starts with `_` is ignored
    if (i.startsWith('_')) {
      validInput = false
    }

    if (validInput) {
      const value = input[i]

      if (value === '_unchecked' || value[0] === '_unchecked') {
        // Delete values when users unselect checkboxes
        delete data[i]
      } else {
        // Remove `_unchecked` from arrays of checkboxes
        if (Array.isArray(value) && typeof value !== 'string') {
          const index = value.indexOf('_unchecked')
          if (index !== -1) {
            value.splice(index, 1)
          }
        } else if (typeof value === 'object') {
          // Store nested objects that aren’t arrays
          if (typeof data[i] !== 'object') {
            data[i] = {}
          }

          // Add nested values
          _storeData(value, data[i])
        }

        data[i] = value
      }
    }
  }
}

/**
 * Store any data sent in session, and pass it to all views
 *
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {Function} next - Next middleware callback
 */
export async function autoStoreData(req, res, next) {
  let sessionDataDefaults = {}

  // Get session default data from file
  let sessionDataDefaultsPath = path.join(process.cwd(), 'app/data.js')
  sessionDataDefaultsPath = pathToFileURL(sessionDataDefaultsPath).href

  try {
    sessionDataDefaults = await import(sessionDataDefaultsPath)

    // Session data can be an (async) function object
    if (typeof sessionDataDefaults.default === 'function') {
      sessionDataDefaults = await sessionDataDefaults.default()
    } else {
      sessionDataDefaults = sessionDataDefaults.default
    }
  } catch (error) {
    console.error('Could not load the session data defaults from app/data.js')
    console.error(error)
  }

  if (!req.session.data) {
    req.session.data = {}
  }

  req.session.data = Object.assign({}, sessionDataDefaults, req.session.data)

  _storeData(req.body, req.session.data)
  _storeData(req.query, req.session.data)

  // Send session data to all views
  res.locals.data = {}
  for (const object in req.session.data) {
    res.locals.data[object] = req.session.data[object]
  }

  next()
}
