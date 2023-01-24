import { readFile } from 'node:fs/promises'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import etag from 'etag'
import fresh from 'fresh'

/**
 * Serves the favicon located by the given `path`.
*
* @public
* @param {String|Buffer} path
* @param {Object} [options]
* @return {Function} middleware
*/

export default function favicon (path, options) {
  const ONE_YEAR_MS = 60 * 60 * 24 * 365 * 1000 // 1 year
  const opts = options || {}

  let icon // favicon cache
  const maxAge = Number.isInteger(opts.maxAge) ? Math.min(Math.max(0, opts.maxAge), ONE_YEAR_MS) : ONE_YEAR_MS

  if (!path) {
    throw new TypeError('path to favicon.ico is required')
  }

  if (Buffer.isBuffer(path)) {
    icon = createIcon(Buffer.from(path), maxAge)
  } else if (typeof path === 'string') {
    path = resolveSync(path)
  } else {
    throw new TypeError('path to favicon.ico must be string or buffer')
  }

  return async function favicon (req, res, next) {
    if (getPathname(req) !== '/favicon.ico') {
      next()
      return
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.statusCode = req.method === 'OPTIONS' ? 200 : 405
      res.setHeader('Allow', 'GET, HEAD, OPTIONS')
      res.setHeader('Content-Length', '0')
      res.end()
      return
    }

    if (icon) {
      send(req, res, icon)
      return
    }

    try {
      const buf = await readFile(path)
      icon = createIcon(buf, maxAge)
      send(req, res, icon)
    } catch (err) {
      return next(err)
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
 * Create EISDIR error.
 *
 * @private
 * @param {string} path
 * @return {Error}
 */

function createIsDirError (path) {
  const error = new Error(`EISDIR, illegal operation on directory '${path}'`)
  error.code = 'EISDIR'
  error.errno = 28
  error.path = path
  error.syscall = 'open'
  return error
}

/**
 * Get the request pathname.
 *
 * @param {object} req
 * @return {string}
 */

function getPathname (req) {
  try {
    return req.path
  } catch (e) {
    return undefined
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
 * Resolve the path to icon.
 *
 * @param {string} iconPath
 * @private
 */

function resolveSync (iconPath) {
  const path = resolve(iconPath)
  const stats = statSync(path)

  if (stats.isDirectory()) {
    throw createIsDirError(path)
  }

  return path
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
    return
  }

  // Send icon
  res.statusCode = 200
  res.setHeader('Content-Length', icon.body.length)
  res.setHeader('Content-Type', 'image/x-icon')
  res.end(icon.body)
}
