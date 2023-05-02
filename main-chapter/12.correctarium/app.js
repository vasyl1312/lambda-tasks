const express = require('express')
const bodyParser = require('body-parser')
const calculateCost = require('./calculateCost')

const app = express()
const port = 3000

app.use(bodyParser.json())

app.post('/calculate', (req, res) => {
  const { language, mimetype, count } = req.body

  try {
    const result = calculateCost(language, mimetype, count)
    res.json(result)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
