const axios = require('axios')
const endpoints = require('./endpoints.json')

let trueCount = 0
let falseCount = 0

const pollEndpoints = async () => {
  try {
    const responses = await Promise.all(endpoints.map((endpoint) => sendRequest(endpoint)))
    responses.forEach((response) => {
      const isDone = findIsDone(response.data)
      console.log(`Endpoint: ${response.config.url}, isDone: ${isDone}`)
      if (isDone === true) {
        trueCount++
      } else if (isDone === false) {
        falseCount++
      }
    })

    console.log(`True count: ${trueCount}`)
    console.log(`False count: ${falseCount}`)
  } catch (error) {
    console.error(`Error while polling endpoints: ${error.message}`)
  }
}

const sendRequest = (url) => {
  return axios.get(url)
}

const findIsDone = (data) => {
  if (typeof data === 'object' && data !== null) {
    if (data.hasOwnProperty('isDone')) {
      return data.isDone
    } else {
      for (const key in data) {
        const result = findIsDone(data[key])
        if (result !== undefined) {
          return result
        }
      }
    }
  }
  return undefined
}

pollEndpoints()
