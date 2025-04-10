import { strict as assert } from 'node:assert'
import { describe, it, mock } from 'node:test'

import mockReqRes from 'mock-req-res'

import { forceHttps } from '../../../lib/middleware/force-https.js'

const { mockRequest, mockResponse } = mockReqRes

describe('Force HTTPS middleware', () => {
  mock.method(console, 'info')

  it('Forces HTTPS', () => {
    const request = mockRequest({
      headers: { 'x-forwarded-proto': 'http' },
      connection: {}
    })
    const response = mockResponse()
    const next = mock.fn(() => {})

    forceHttps(request, response, next)

    assert.equal(response.redirect.calledWith(302), true)
  })

  it('Forces HTTPS for prototype on Glitch.com', () => {
    const request = mockRequest({
      headers: { 'x-forwarded-proto': 'http, foo' },
      connection: {}
    })
    const response = mockResponse()
    const next = mock.fn(() => {})

    forceHttps(request, response, next)

    assert.equal(response.redirect.calledWith(302), true)
  })

  it('Doesn’t forces HTTPS if already using that protocol', () => {
    const request = mockRequest({
      connection: {}
    })
    const response = mockResponse()
    const next = mock.fn(() => {})

    forceHttps(request, response, next)

    assert.equal(next.mock.callCount(), 1)
  })
})
