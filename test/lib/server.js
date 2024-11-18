import { strict as assert } from 'node:assert'
import { after, describe, it } from 'node:test'

import supertest from 'supertest'

import server from '../../lib/server.js'

describe('Server', () => {
  const app = server.listen()
  const request = supertest.agent(app)

  it('Serves an HTML file', async () => {
    const response = await request.get('/')

    assert.equal(response.type, 'text/html')
    assert.equal(response.status, 200)
  })

  it('Serves robots.txt', async () => {
    const response = await request.get('/robots.txt')

    assert.equal(response.status, 200)
  })

  it('Adds x-robots-tag header', async () => {
    const response = await request.get('/')

    assert.equal(response.headers['x-robots-tag'], 'noindex')
  })

  it('Shows clear session data page', async () => {
    const response = await request.get('/clear-session-data')

    assert.equal(response.status, 200)
    assert.match(response.text, /Clear session data\?/)
  })

  it('Shows clear session data confirmation page', async () => {
    const response = await request.post('/clear-session-data')

    assert.equal(response.status, 200)
    assert.match(response.text, /Session data cleared/)
  })

  it('Shows feature flags page', async () => {
    const response = await request.get('/feature-flags')

    assert.equal(response.status, 200)
    assert.match(response.text, /Feature flags/)
  })

  it('Shows feature flags confirmation page', async () => {
    const response = await request.post('/feature-flags').send({
      features: {
        foo: { name: 'Foo', on: 'true' },
        bar: { name: 'Bar', on: 'false' }
      }
    })

    assert.equal(response.status, 200)
    assert.match(response.text, /Feature flags updated/)
  })

  it('Shows password page', async () => {
    const response = await request.get('/prototype-password')

    assert.equal(response.status, 200)
    assert.match(response.text, /This is a prototype used for research/)
  })

  it('Shows password page with validation error', async () => {
    process.env.NODE_ENV = 'production'
    process.env.PASSWORD = 'test'
    const response = await request
      .post('/prototype-password')
      .send({ _password: 'incorrect' })

    assert.equal(response.status, 422)
    assert.match(response.text, /The password is not correct/)
  })

  it('Redirects authenticated user to previous page', async () => {
    process.env.NODE_ENV = 'production'
    process.env.PASSWORD = 'test'
    const response = await request
      .post('/prototype-password')
      .send({ _password: 'test' })
      .send({ returnUrl: '/' })

    assert.equal(response.status, 302)
  })

  // it('Throws error if trying to redirect to an external site', async () => {
  //   process.env.NODE_ENV = 'production'
  //   process.env.PASSWORD = 'test'
  //   const response = await request.post('/prototype-password')
  //     .send({ _password: 'test' })
  //     .send({ returnUrl: 'https://gov.uk' })

  //   assert.equal(response.status, 500)
  //   assert.match(response.text, /Return URL must be a page in this prototype/)
  // })

  it('Shows 404 not found page', async () => {
    const response = await request.get('/not-found')

    assert.equal(response.status, 404)
  })

  after(function (done) {
    app.close(done)
    process.exit(0)
  })
})
