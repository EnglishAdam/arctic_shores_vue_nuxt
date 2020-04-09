const fetch = require('node-fetch')
const { Router } = require('express')
const router = Router()
const log = require('../../services/log')

// Nuxt doesn't load .env file
require('dotenv').config()

/* GET user by ID. */
router.get('/weather/:cityName', async function(req, res, next) {
  // Get required properties
  const { cityName } = req.params
  const { API_KEY } = process.env

  // Log request using chronological id
  const logId = Date.now()
  const logObject = {
    request: {
      cityName,
      date: Date.now()
    }
  }

  // Log to id
  log(logId, logObject)

  // Attempt to fetch weather data
  try {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`)
    const body = await response.json()

    // Log response
    logObject.response = body
    log(logId, logObject)

    // If successful, return data
    res.status(200).send(body)
  } catch ({ message, code }) {
    // Log response
    logObject.response = { message, code }
    log(logId, logObject)

    // If error occures provide message
    res.status(500).send(message)
  }
})

module.exports = router
