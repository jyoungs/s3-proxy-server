const express = require('express')
const aws4  = require('aws4')
const https = require('https')
const auth = require('basic-auth')

const config = require('./config')

const app = express()

app.set('subdomain offset', config.hostname ? config.hostname.split('.').length : 2)
const realm = config.hostname || 'S3 Proxy'

app.use((req, res, next) => {
  const user = auth(req)
  if (!config.username || !config.password) return next()
  if (!user || user.name !== config.username || user.pass !== config.password) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"')
    res.end('Access denied')
  } else {
    next()
  }
})

app.use((req, res, next) => {
  let path = '/' + config.bucket
  if (req.subdomains.length) {
    path += req.subdomains.join('/')
  }
  path += req.path.replace(/\/$/, '/index.html')
  const opts = aws4.sign({
    service: 's3',
    path: path
  })
  https.get(opts, (s3Response) => {
    res.set(filterS3ResponseHeaders(s3Response.headers))
    if (s3Response.statusCode !== 200) {
      const err = new Error('S3 proxy error')
      err.status = s3Response.statusCode
      return next(err)
    }
    s3Response.on('error', next)
    s3Response.pipe(res)
  }).on('error', next)
})

function filterS3ResponseHeaders (headers) {
  const out = {}
  for (const field of Object.keys(headers)) {
    if (field === 'date') continue // let this server set the date
    if (field === 'server') continue // sending `server: AmazonS3` messes with CloudFront
    if (field === 'connection') continue // let this server handle it
    if (/^x-amz-/.test(field)) continue // don't send aws headers
    out[field] = headers[field]
  }
  return out
}

module.exports = app
