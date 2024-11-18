import { strict as assert } from 'node:assert'
import process from 'node:process'
import { describe, it } from 'node:test'

import mockReqRes from 'mock-req-res'
import sinon from 'sinon'

import { authentication } from '../../../lib/middleware/authentication.js'

const { mockRequest, mockResponse } = mockReqRes

describe('Authentication middleware', () => {
  it('Doesn’t authenticate password page', () => {
    const request = mockRequest({ path: '/prototype-password' })
    const response = mockResponse()
    const next = sinon.spy()

    authentication(request, response, next)

    assert.equal(next.calledOnce, true)
  })

  it('Shows custom error page if password hasn’t been set', () => {
    const request = mockRequest({ path: '/' })
    const response = mockResponse()
    const next = sinon.spy()

    authentication(request, response, next)

    assert.equal(response.status.calledWith(501), true)
    assert.equal(response.render.calledWith('no-password-set.njk'), true)
  })

  it('Redirects unauthenticated to user to password page', () => {
    process.env.PASSWORD = 'test'

    const request = mockRequest({ path: '/' })
    const response = mockResponse()
    const next = sinon.spy()

    authentication(request, response, next)

    assert.equal(response.redirect.calledOnce, true)
    assert.equal(
      response.redirect.calledWith(
        'https://undefined/prototype-password?returnUrl='
      ),
      true
    )
  })

  it('Allows authenticated user to continue', (t) => {
    process.env.PASSWORD = 'test'

    const request = mockRequest({
      cookies: {
        authentication:
          '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      },
      path: '/'
    })
    const response = mockResponse()
    const next = sinon.spy()

    authentication(request, response, next)

    assert.equal(next.calledOnce, true)
  })
})
