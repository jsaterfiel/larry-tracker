const express = require('express')
const app = express()
const port = 8181

app.get('/', (req, res) => res.send('<html><head><title>Larry Tracker API</title></head><body><h1>Larry Tracker API!</h1></body></html>'))

app.get('/api/ping', async (req, res) => {
  let output = {
    'pong': true
  }
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(output))
})

app.listen(port, () => console.log(`Larry Tracker API listening on port ${port}!`))
