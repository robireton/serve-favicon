import assert from 'node:assert'
import http from 'node:http'
// import { describe, it, before, beforeEach, afterEach } from 'node:test'
import { cwd } from 'node:process'
import { describe, it, before } from 'node:test'
import { Buffer } from 'node:buffer'
import { join } from 'node:path'
import favicon from '../index.js'
// import { TempIcon } from './support/tempIcon.js'
// const request = require('supertest')

const FIXTURES_PATH = join(cwd(), 'test', 'fixtures')
const ICON_PATH = join(FIXTURES_PATH, 'favicon.ico')

describe('favicon()', function () {
  describe('arguments', function () {
    describe('path', function () {
      it('should be required', function () {
        assert.throws(favicon.bind(), /path.*required/)
      })

      it('should accept file path', function () {
        assert.doesNotThrow(favicon.bind(null, join(FIXTURES_PATH, 'favicon.ico')))
      })

      it('should accept buffer', function () {
        assert.doesNotThrow(favicon.bind(null, Buffer.alloc(20)))
      })

      it('should exist', function () {
        assert.throws(favicon.bind(null, join(FIXTURES_PATH, 'nothing')), /ENOENT.*nothing/)
      })

      it('should not be dir', function () {
        assert.throws(favicon.bind(null, FIXTURES_PATH), /EISDIR.*fixtures/)
      })

      it('should not be number', function () {
        assert.throws(favicon.bind(null, 12), /path.*must be.*string/)
      })
    })

    // describe('options.maxAge', () => {
    //   it('should be in cache-control', done => {
    //     const server = createServer(null, { maxAge: 5000 }).listen()
    //     request(server)
    //       .get('/favicon.ico')
    //       .expect('Cache-Control', 'public, max-age=5')
    //       .expect(200, done)
    //   })
    // })

    /*
    describe('options.maxAge', function () {
      it('should be in cache-control', function (done) {
        const server = createServer(null, { maxAge: 5000 })
        request(server)
          .get('/favicon.ico')
          .expect('Cache-Control', 'public, max-age=5')
          .expect(200, done)
      })

      it('should have a default', function (done) {
        const server = createServer()
        request(server)
          .get('/favicon.ico')
          .expect('Cache-Control', /public, max-age=[0-9]+/)
          .expect(200, done)
      })

      it('should accept 0', function (done) {
        const server = createServer(null, { maxAge: 0 })
        request(server)
          .get('/favicon.ico')
          .expect('Cache-Control', 'public, max-age=0')
          .expect(200, done)
      })

      it('should accept string', function (done) {
        const server = createServer(null, { maxAge: '30d' })
        request(server)
          .get('/favicon.ico')
          .expect('Cache-Control', 'public, max-age=2592000')
          .expect(200, done)
      })

      it('should be valid delta-seconds', function (done) {
        const server = createServer(null, { maxAge: 1234 })
        request(server)
          .get('/favicon.ico')
          .expect('Cache-Control', 'public, max-age=1')
          .expect(200, done)
      })

      it('should floor at 0', function (done) {
        const server = createServer(null, { maxAge: -4000 })
        request(server)
          .get('/favicon.ico')
          .expect('Cache-Control', 'public, max-age=0')
          .expect(200, done)
      })

      it('should ceil at 1 year', function (done) {
        const server = createServer(null, { maxAge: 900000000000 })
        request(server)
          .get('/favicon.ico')
          .expect('Cache-Control', 'public, max-age=31536000')
          .expect(200, done)
      })

      it('should accept Inifnity', function (done) {
        const server = createServer(null, { maxAge: Infinity })
        request(server)
          .get('/favicon.ico')
          .expect('Cache-Control', 'public, max-age=31536000')
          .expect(200, done)
      })
    })
    */
  })

  describe('requests', function () {
    before(function () {
      this.server = createServer()
    })
    /*
    it('should serve icon', function (done) {
      request(this.server)
        .get('/favicon.ico')
        .expect('Content-Type', 'image/x-icon')
        .expect(200, done)
    })

    it('should include cache-control', function (done) {
      request(this.server)
        .get('/favicon.ico')
        .expect('Cache-Control', /public/)
        .expect(200, done)
    })

    it('should include strong etag', function (done) {
      request(this.server)
        .get('/favicon.ico')
        .expect('ETag', /^"[^"]+"$/)
        .expect(200, done)
    })

    it('should deny POST', function (done) {
      request(this.server)
        .post('/favicon.ico')
        .expect('Allow', 'GET, HEAD, OPTIONS')
        .expect(405, done)
    })

    it('should understand OPTIONS', function (done) {
      request(this.server)
        .options('/favicon.ico')
        .expect('Allow', 'GET, HEAD, OPTIONS')
        .expect(200, done)
    })

    it('should 304 when If-None-Match matches', function (done) {
      const server = this.server
      request(server)
        .get('/favicon.ico')
        .expect(200, function (err, res) {
          if (err) return done(err)
          request(server)
            .get('/favicon.ico')
            .set('If-None-Match', res.headers.etag)
            .expect(304, done)
        })
    })

    it('should 304 when If-None-Match matches weakly', function (done) {
      const server = this.server
      request(server)
        .get('/favicon.ico')
        .expect(200, function (err, res) {
          if (err) return done(err)
          request(server)
            .get('/favicon.ico')
            .set('If-None-Match', 'W/' + res.headers.etag)
            .expect(304, done)
        })
    })

    it('should ignore non-favicon requests', function (done) {
      request(this.server)
        .get('/')
        .expect(404, 'oops', done)
    })

    it('should work with query string', function (done) {
      request(this.server)
        .get('/favicon.ico?v=1')
        .expect('Content-Type', 'image/x-icon')
        .expect(200, done)
    })
    */
    describe('missing req.url', function () {
      it('should ignore the request', function (done) {
        const fn = favicon(ICON_PATH)
        fn({}, {}, done)
      })
    })
  })

  /*
  describe('icon', function () {
    describe('file', function () {
      beforeEach(function () {
        this.icon = new TempIcon()
        this.icon.writeSync()
      })

      afterEach(function () {
        this.icon.unlinkSync()
        this.icon = undefined
      })

      it('should be read on first request', function (done) {
        const icon = this.icon
        const server = createServer(icon.path)

        request(server)
          .get('/favicon.ico')
          .expect(200, icon.data, done)
      })

      it('should cache for second request', function (done) {
        const icon = this.icon
        const server = createServer(icon.path)

        request(server)
          .get('/favicon.ico')
          .expect(200, icon.data, function (err) {
            if (err) return done(err)
            icon.unlinkSync()
            request(server)
              .get('/favicon.ico')
              .expect(200, icon.data, done)
          })
      })
    })

    describe('file error', function () {
      beforeEach(function () {
        this.icon = new TempIcon()
        this.icon.writeSync()
      })

      afterEach(function () {
        this.icon.unlinkSync()
        this.icon = undefined
      })

      it('should next() file read errors', function (done) {
        const icon = this.icon
        const server = createServer(icon.path)

        icon.unlinkSync()
        request(server)
          .get('/favicon.ico')
          .expect(500, /ENOENT/, done)
      })

      it('should retry reading file after error', function (done) {
        const icon = this.icon
        const server = createServer(icon.path)

        icon.unlinkSync()
        request(server)
          .get('/favicon.ico')
          .expect(500, /ENOENT/, function (err) {
            if (err) return done(err)
            icon.writeSync()
            request(server)
              .get('/favicon.ico')
              .expect(200, icon.data, done)
          })
      })
    })

    describe('buffer', function () {
      it('should be served from buffer', function (done) {
        const buffer = Buffer.alloc(20, '#')
        const server = createServer(buffer)

        request(server)
          .get('/favicon.ico')
          .expect('Content-Length', '20')
          .expect(200, buffer, done)
      })

      it('should be copied', function (done) {
        const buffer = Buffer.alloc(20, '#')
        const server = createServer(buffer)

        assert.equal(buffer.toString(), '####################')
        buffer.fill('?')
        assert.equal(buffer.toString(), '????????????????????')

        request(server)
          .get('/favicon.ico')
          .expect('Content-Length', '20')
          .expect(200, Buffer.from('####################'), done)
      })
    })
  })
  */
})

function createServer (path = ICON_PATH, opts = {}) {
  const _favicon = favicon(path, opts)
  return http.createServer((_req, _res) => {
    _favicon((_req, res, err) => {
      res.statusCode = err ? (err.status || 500) : 404
      res.end(err ? err.message : 'oops')
    })
  })
}
