const express = require('express')

// Create express instance
const app = express()

// Require API routes
const health = require('./routes/health')
const weather = require('./routes/weather')

// Import API Routes
app.use(health)
app.use(weather)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
