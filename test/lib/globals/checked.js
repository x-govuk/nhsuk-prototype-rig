import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

import nunjucks from 'nunjucks'

import { checked } from '../../../lib/globals/checked.js'

describe('Checked global', () => {
  const views = [
    './',
    './node_modules/nhsuk-frontend/packages/components',
    './test/fixtures'
  ]
  const env = nunjucks.configure(views)
  env.addGlobal('checked', checked)

  it('Checks input if a property value exists', () => {
    const result = env.render('radios.njk', {
      data: { country: 'england' }
    })

    assert.match(result, /name="country".*value="england".*checked/)
  })

  it('Checks input if a property value exists in array', () => {
    const result = env.render('checkboxes.njk', {
      data: { nationality: ['british', 'irish'] }
    })

    assert.match(result, /name="nationality".*value="british".*checked/)
    assert.match(result, /name="nationality".*value="irish".*checked/)
    assert.match(result, /name="nationality".*value="other">/)
  })

  it('Doesn’t check input if no context data', () => {
    const result = env.render('checkboxes.njk', {})

    assert.match(result, /name="nationality".*value="british">/)
    assert.match(result, /name="nationality".*value="irish">/)
  })

  it('Doesn’t check input if no values found', () => {
    const result = env.render('radios.njk', {
      data: { foo: 'bar' }
    })

    assert.match(result, /name="country".*value="england">/)
    assert.match(result, /name="country".*value="wales">/)
    assert.match(result, /name="country".*value="scotland">/)
    assert.match(result, /name="country".*value="northern-ireland">/)
  })
})
