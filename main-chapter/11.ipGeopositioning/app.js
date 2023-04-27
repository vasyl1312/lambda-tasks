const express = require('express')
const csv = require('csv-parser')
const axios = require('axios')
const fs = require('fs')
const app = express()
const PORT = 3000

function ipToDecimal(ipAddress) {
  var octets = ipAddress.split('.')

  var decimalIpAddress = octets.reduce(function (decimal, octet, index) {
    return decimal + parseInt(octet) * Math.pow(256, 3 - index)
  }, 0)

  return decimalIpAddress
}

function isIPInRange(ip, ipFrom, ipTo) {
  var decimalIP = ipToDecimal(ip)

  return decimalIP >= ipFrom && decimalIP <= ipTo
}

app.get('/', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.ipify.org?format=json')

    // const inputIP = '45.232.208.143'  //Chile
    // Armenia — 185.182.120.34
    // Mexico — 45.177.176.23
    // Turkey — 5.44.80.51

    const inputIP = data.ip
    ipToDecimal(inputIP)

    const stream = fs.createReadStream('db.csv').pipe(csv({ separator: ',' }))

    stream.on('data', (row) => {
      let ip_from = Object.values(row)[0]
      let ip_to = Object.values(row)[1]
      let country_short = Object.values(row)[2]

      if (isIPInRange(inputIP, ip_from, ip_to)) {
        const response = { 'ip-address': inputIP, country: country_short }
        res.json(response)
        stream.destroy()
      }
    })

    stream.on('end', () => {
      res.status(404).json({ error: "IP-address wasn't found" })
    })
  } catch (error) {
    console.error(error)
    res.send('Error getting IP address')
  }
})

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})
