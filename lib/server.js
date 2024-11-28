import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import url from 'node:url'

import sessionInCookie from 'client-sessions'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import rateLimit from 'express-rate-limit'
import sessionInMemory from 'express-session'

import { compileAssets } from './assets.js'
import { browserSyncConfig } from './browser-sync.js'
import { getConfig } from './config.js'
import { findAvailablePort } from './environment.js'
import { getEnv, getEnvBoolean } from './environment.js'
import { authentication } from './middleware/authentication.js'
import { autoStoreData } from './middleware/auto-store-data.js'
import { notFoundError, internalServerError } from './middleware/error.js'
import { forceHttps } from './middleware/force-https.js'
import { matchRoutes } from './middleware/match-routes.js'
import { getNunjucksEnv } from './nunjucks.js'
import { authenticationRoutes } from './routes/authentication.js'
import { autoStoreDataRoutes } from './routes/auto-store-data.js'
import { featureFlagRoutes } from './routes/feature-flags.js'
import { robotsRoutes } from './routes/robots.js'

// Environment
const env = getEnv()
const isProduction = env === 'production'

// Configuration
const config = await getConfig()
const useAuth = getEnvBoolean('USE_AUTH', config)
const useAutoStoreData = getEnvBoolean('USE_AUTO_STORE_DATA', config)
const useCookieSessionStore = getEnvBoolean('USE_COOKIE_SESSION_STORE', config)
const useHttps = getEnvBoolean('USE_HTTPS', config)

// Set up Express app
const app = express()
const router = express.Router()

// Compress responses
app.use(compression())

// Rate limit requests
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false
})

// Make config variables available to all views
app.locals = { ...app.locals, ...config }

// Force HTTPS on production. Do this before using authentication to avoid
// asking for username/password twice (for `http`, then `https`)
const isSecure = isProduction && useHttps
if (isSecure) {
  app.use(forceHttps)
  app.set('trust proxy', 1) // Needed for secure cookies on Heroku
}

// Set views engine
app.engine(config.templateExtension, getNunjucksEnv(app, env).render)
app.set('view engine', config.templateExtension)

// Serve compiled static assets
app.use('/assets', express.static('./assets'))

// Serve static assets
app.use('/public', express.static('./app/assets'))
app.use(
  '/nhsuk/assets',
  express.static('./node_modules/nhsuk-frontend/packages/assets')
)
app.use(
  '/nhsuk-frontend',
  express.static('./node_modules/nhsuk-frontend/packages')
)
app.use('/nhsuk-frontend', express.static('./node_modules/nhsuk-frontend/dist'))

// Form validation
app.use(
  '/validate.js',
  express.static('./node_modules/validate.js/validate.js')
)
app.use(
  '/form-validation.js',
  express.static('./node_modules/nhsuk-prototype-rig/lib/form-validation.js')
)

// Support parsing data in POSTs
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

// Session uses `config.serviceName` to avoid clashes with other prototypes
const uniqueId = Buffer.from(config.serviceName, 'utf8').toString('hex')
const sessionName = `nhsuk-prototype-rig-${uniqueId}`
const sessionOptions = {
  secret: sessionName,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4, // 4 hours
    secure: isSecure
  }
}

// Support session data in cookie or memory
if (useCookieSessionStore) {
  app.use(
    sessionInCookie(
      Object.assign(sessionOptions, {
        cookieName: sessionName,
        proxy: true,
        requestKey: 'session'
      })
    )
  )
} else {
  app.use(
    sessionInMemory(
      Object.assign(sessionOptions, {
        name: sessionName,
        resave: false,
        saveUninitialized: false
      })
    )
  )
}

// Use cookie middleware for reading authentication cookie
app.use(cookieParser())

// Authentication
if (isProduction && useAuth) {
  app.use(limit)
  app.use(authentication)
}

// Automatically store all data users enter
if (useAutoStoreData) {
  app.use(autoStoreData, autoStoreDataRoutes(router))
  app.use(
    '/auto-store-data.js',
    express.static('./node_modules/nhsuk-prototype-rig/lib/auto-store-data.js')
  )
}

// Password protect pages
app.use(authenticationRoutes(router))

// Prevent search indexing
app.use(robotsRoutes(router))

// Feature flags
app.use(featureFlagRoutes(router))

// Load routes
let appRoutesPath = path.join(process.cwd(), 'app/routes.js')
if (fs.existsSync(appRoutesPath)) {
  appRoutesPath = url.pathToFileURL(appRoutesPath).href
  const appRoutes = await import(appRoutesPath)
  app.use('/', appRoutes.default)
}

// Strip .html and .htm if provided
app.get(/\.html?$/i, (req, res) => {
  let { path } = req
  const parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

// Auto render any view that exists
app.get(/^([^.]+)$/, matchRoutes)

// Redirect POST requests to a GET requests, while preserving components of
// original URL, allowing users to use POST for autoStoreData.
app.post(/^\/([^.]+)$/, (req, res) => {
  res.redirect(
    url.format({
      pathname: `/${req.params[0]}`,
      query: req.query
    })
  )
})

app.use(notFoundError, internalServerError)

findAvailablePort(async (port) => {
  if (process.env.NODE_ENV !== 'production') {
    const proxyPort = port - 50
    app.listen(proxyPort, () => browserSyncConfig(app, port, proxyPort))
    await compileAssets(true)
  } else {
    await compileAssets()
    console.info(`Listening on port ${port}`)
    app.listen(port)
  }
})

export default app
