import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

import mockReqRes from 'mock-req-res'
import sinon from 'sinon'

import {
  notFoundError,
  internalServerError
} from '../../../lib/middleware/error.js'

const { mockRequest, mockResponse } = mockReqRes

describe('Error middleware', () => {
  sinon.stub(console, 'error')

  it('Returns 404 for page not found', () => {
    const request = mockRequest()
    const response = mockResponse()
    const next = sinon.spy()

    notFoundError(request, response, next)

    assert.equal(response.status.calledWith(404), true)
    assert.equal(response.render.calledOnceWith('404.njk'), true)
  })

  it('Returns 500 for unknown error', () => {
    const unknownError = new Error('Unknown')
    const request = mockRequest()
    const response = mockResponse()
    const next = sinon.spy()

    internalServerError(unknownError, request, response, next)

    assert.equal(response.status.calledWith(500), true)
    assert.equal(response.render.calledOnceWith('500.njk'), true)
  })
})
