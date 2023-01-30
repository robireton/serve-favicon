import { Buffer } from 'node:buffer'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import etag from '@robireton/etag'
import fresh from '@robireton/fresh'

/**
 * Serves the favicon located by the given `path`.
*
* @public
* @param {String|Buffer} resource
* @param {Object} [options]
* @return {Function} middleware
*/

export default function favicon (resource = 'favicon.ico', options = {}) {
  const ONE_YEAR_MS = 60 * 60 * 24 * 365 * 1000 // 1 year

  let icon // favicon cache
  const maxAge = Number.isInteger(options.maxAge) ? Math.min(Math.max(0, options.maxAge), ONE_YEAR_MS) : ONE_YEAR_MS

  if (Buffer.isBuffer(resource)) {
    icon = createIcon(Buffer.from(resource), maxAge)
  } else if (typeof resource === 'string') {
    icon = createIcon(readFileSync(resolve(resource)), maxAge)
  } else {
    throw new TypeError('resource must be path to favicon or buffer')
  }

  return (req, res, next) => {
    if (req.path === '/favicon.ico') {
      if (req.method === 'GET' || req.method === 'HEAD') {
        send(req, res, icon)
      } else {
        res.statusCode = (req.method === 'OPTIONS') ? 200 : 405
        res.setHeader('Allow', 'GET, HEAD, OPTIONS')
        res.setHeader('Content-Length', '0')
        res.end()
      }
    } else {
      next()
    }
  }
}

/**
 * Create icon data from Buffer and max-age.
 *
 * @private
 * @param {Buffer} buf
 * @param {number} maxAge
 * @return {object}
 */

function createIcon (buf, maxAge) {
  return {
    body: buf,
    headers: {
      'Cache-Control': `public, max-age=${Math.floor(maxAge / 1000)}`,
      ETag: etag(buf)
    }
  }
}

/**
 * Determine if the cached representation is fresh.
 *
 * @param {object} req
 * @param {object} res
 * @return {boolean}
 * @private
 */

function isFresh (req, res) {
  return fresh(req.headers, {
    etag: res.getHeader('ETag'),
    'last-modified': res.getHeader('Last-Modified')
  })
}

/**
 * Send icon data in response to a request.
 *
 * @private
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} res
 * @param {object} icon
 */

function send (req, res, icon) {
  // Set headers
  const headers = icon.headers
  const keys = Object.keys(headers)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    res.setHeader(key, headers[key])
  }

  // Validate freshness
  if (isFresh(req, res)) {
    res.statusCode = 304
    res.end()
  } else {
    // Send icon
    res.statusCode = 200
    res.setHeader('Content-Length', icon.body.length)
    res.setHeader('Content-Type', 'image/x-icon')
    res.end(icon.body)
  }
}
