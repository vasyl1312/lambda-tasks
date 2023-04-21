const fs = require('fs')

const inputFile = 'input.json'
const outputFile = 'output.json'

function filterKeys(obj) {
  const filteredObj = {}

  if (obj.hasOwnProperty('user') && typeof obj['user'] === 'object') {
    const userKeys = Object.keys(obj['user'])
    for (const userKey of userKeys) {
      if (userKey === '_id' || userKey === 'name') {
        filteredObj[userKey] = obj['user'][userKey]
      }
    }
  }

  if (obj.hasOwnProperty('startDate')) {
    filteredObj['startDate'] = obj['startDate']
  }

  if (obj.hasOwnProperty('endDate')) {
    filteredObj['endDate'] = obj['endDate']
  }

  return filteredObj
}

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`)
    return
  }

  try {
    const parsedData = JSON.parse(data)
    if (!Array.isArray(parsedData)) {
      console.error('Input file must be an array of objects!')
      return
    }

    const groupedData = {}
    for (const obj of parsedData) {
      if (
        obj.hasOwnProperty('user') &&
        typeof obj['user'] === 'object' &&
        obj['user'].hasOwnProperty('_id')
      ) {
        const userId = obj['user']['_id']
        if (!groupedData.hasOwnProperty(userId)) {
          groupedData[userId] = {
            userId: userId,
            name: obj['user']['name'],
            weekendDates: [],
          }
        }
        const filteredData = filterKeys(obj)
        delete filteredData.name
        delete filteredData._id
        groupedData[userId].weekendDates.push(filteredData)
      }
    }

    const groupedArray = Object.values(groupedData)

    const groupedDataString = JSON.stringify(groupedArray, null, 2)

    fs.writeFile(outputFile, groupedDataString, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file: ${err}`)
        return
      }
      console.log('Successfully wrote to file!\n' + groupedDataString)
    })
  } catch (err) {
    console.error(`Error with parsing JSON: ${err}`)
  }
})
