const { Router } = require('express')

const router = Router()

/**
 * Health check endpoint
 */
router.get('/', function(req, res, next) {
  res.status(200).send('Server health okay')
})

/**
 * Health check endpoint
 */
router.get('/health-check', function(req, res, next) {
  res.status(200).send('Server health okay')
})

module.exports = router
