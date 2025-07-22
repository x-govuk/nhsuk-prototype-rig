import { strict as assert } from 'node:assert'
import { describe, it, mock } from 'node:test'

import mockReqRes from 'mock-req-res'

import {
  notFoundError,
  internalServerError
} from '../../../lib/middleware/error.js'

const { mockRequest, mockResponse } = mockReqRes

describe('Error middleware', () => {
  mock.method(console, 'error')

  it('Returns 404 for page not found', () => {
    const request = mockRequest()
    const response = mockResponse()
    const next = mock.fn(() => {})

    notFoundError(request, response, next)

    assert.equal(response.status.calledWith(404), true)
    assert.equal(response.render.calledOnceWith('404.njk'), true)
  })

  it('Returns 500 for unknown error', () => {
    const unknownError = new Error('Unknown')
    const request = mockRequest()
    const response = mockResponse()
    const next = mock.fn(() => {})
    mock.method(console, "error", () => {}); // Disable console.info

    internalServerError(unknownError, request, response, next)

    assert.equal(response.status.calledWith(500), true)
    assert.equal(response.render.calledOnceWith('500.njk'), true)
  })
})
