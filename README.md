# serve-favicon

Node.js middleware for serving a favicon.

A favicon is a visual cue that client software, like browsers, use to identify
a site. For an example and more information, please visit
[the Wikipedia article on favicons](https://en.wikipedia.org/wiki/Favicon).

Why use this module?

  - User agents request `favicon.ico` frequently and indiscriminately, so you
    may wish to exclude these requests from your logs by using this middleware
    before your logger middleware.
  - This module caches the icon in memory to improve performance by skipping
    disk access.
  - This module provides an `ETag` based on the contents of the icon, rather
    than file system properties.
  - This module will serve with the most compatible `Content-Type`.

**Note** This module is exclusively for serving the “default, implicit favicon”,
which is `GET /favicon.ico`. For additional vendor-specific icons that require
HTML markup, additional middleware is required to serve the relevant files, for
example [serve-static](https://npmjs.org/package/serve-static).

## Install

This is an ECMAScript Module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install @robireton/serve-favicon
```

## API

### favicon(path, options)

Create new middleware to serve a favicon from the given `path` to a favicon file.
`path` may also be a `Buffer` of the icon to serve.

#### Options

Serve favicon accepts these properties in the options object.

##### maxAge

The `cache-control` `max-age` directive in `ms`, defaulting to 1 year.

## Example

Typically this middleware will come very early in your stack (maybe even first)
to avoid processing any other middleware if we already know the request is for
`/favicon.ico`.

### express

```javascript
import { resolve } from 'node:path'
import express from 'express'
import favicon from 'serve-favicon'

const app = express()
app.use(favicon(resolve('static/favicon.ico')))

// Add your routes here, etc.

app.listen(3000)
```

## License

[MIT](LICENSE)
