import _ from 'lodash'

/**
 * Check input if a property value exists.
 *
 * @param {string} keyPath - Path to key (using dot/bracket notation)
 * @param {string} value - Value to check
 * @returns {boolean} Returns `true` if `value` exists, else `false`
 */
export function checked(keyPath, value) {
  keyPath = _.toPath(keyPath)

  const { data } = this.ctx
  if (!data) {
    return
  }

  const storedValue = data[keyPath]
  if (!storedValue) {
    return
  }

  let checkedValue = ''

  if (Array.isArray(storedValue)) {
    // Stored value is an array, check it exists in the array
    if (storedValue.indexOf(value) !== -1) {
      checkedValue = 'checked'
    }
  } else {
    // Stored value is a simple value, check it matches
    if (storedValue === value) {
      checkedValue = 'checked'
    }
  }

  return checkedValue
}
