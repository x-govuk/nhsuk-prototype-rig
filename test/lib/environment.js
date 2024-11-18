import { strict as assert } from 'node:assert'
import process from 'node:process'
import { describe, it } from 'node:test'

import { getEnvBoolean } from '../../lib/environment.js'

describe('Environment', () => {
  process.env.TEST_OPTION_1 = 'TRUE'

  it('Gets environment variable as a boolean value', () => {
    assert.equal(getEnvBoolean('TEST_OPTION_1'), true)
  })

  it('Gets environment variable as a boolean value, overriding config', () => {
    assert.equal(getEnvBoolean('TEST_OPTION_1', { testOption1: false }), true)
  })

  it('Defaults to value in config if no environment variable', () => {
    assert.equal(getEnvBoolean('TEST_OPTION_2', { testOption2: false }), false)
  })
})
