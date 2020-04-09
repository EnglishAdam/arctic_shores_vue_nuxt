const fs = require('fs')
const fetch = require('node-fetch')

// Load .env
require('dotenv').config()

describe('Server', () => {
  test('is healthy', async () => {
    let response = await fetch(process.env.BASE_URL + '/api/health-check')
    response = await response.text()
    expect(response).toMatch('Server health okay')
  })

  test('is able to request weather data', async () => {
    let response = await fetch(process.env.BASE_URL + '/api/weather/shrewsbury')
    response = await response.json()
    expect(response.cod).toEqual(200)
  })

  test('logs the request response data for the weather api', async () => {
    // Get number of logs
    const numberOfLogsBefore = fs.readdirSync('./logs').length

    // Make request
    await fetch(process.env.BASE_URL + '/api/weather/shrewsbury')

    // Get number of logs
    const numberOfLogsAfter = fs.readdirSync('./logs').length
    console.log(numberOfLogsBefore, numberOfLogsAfter)
    expect(numberOfLogsAfter).toBeGreaterThan(numberOfLogsBefore)
  })
})
