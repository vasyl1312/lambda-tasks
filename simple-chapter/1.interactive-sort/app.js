const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let input = ''
let sortingMethod = ''
let uniqueValues = []

function sortWordsAlphabetically(words) {
  return words.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
}

function sortNumbersFromSmallest(numbers) {
  return numbers.sort((a, b) => a - b)
}

function sortNumbersFromLargest(numbers) {
  return numbers.sort((a, b) => b - a)
}

function displayWordsByLength(words) {
  return words.sort((a, b) => a.length - b.length)
}

function showUniqueWords(words) {
  return [...new Set(words)]
}

function showUniqueValues(values) {
  return [...new Set(values)]
}

function handleInput(input) {
  const values = input.split(' ')

  const words = values.filter((value) => isNaN(value))
  const numbers = values.filter((value) => !isNaN(value)).map(Number)

  switch (sortingMethod) {
    case '1':
      console.log(sortWordsAlphabetically(words))
      break
    case '2':
      console.log(sortNumbersFromSmallest(numbers))
      break
    case '3':
      console.log(sortNumbersFromLargest(numbers))
      break
    case '4':
      console.log(displayWordsByLength(words))
      break
    case '5':
      console.log(showUniqueWords(words))
      break
    case '6':
      uniqueValues = [...new Set([...uniqueValues, ...values])]
      console.log(showUniqueValues(uniqueValues))
      break
    default:
      console.log('You entered something wrong...')
  }
}

function startApp() {
  rl.question(
    'Enter the text that will have words and numbers separated by spaces\n' +
      'or to end the program write `exit`: ',
    (answer) => {
      input = answer.trim()
      if (input === 'exit') {
        console.log('Have a good day)')
        rl.close()
        return
      }

      rl.question(
        `\nSelect the appropriate command number and press ENTER to:
        1. Sort only words alphabetically
        2. Display only numbers from smallest to largest
        3. Display only numbers from the largest to the smallest
        4. Display only words in increasing number of letters in the word
        5. Show only unique words
        6. Show only unique values ​​from the entire set of words and numbers entered by the user.
        
        Select the number: `,
        (answer) => {
          sortingMethod = answer.trim()
          handleInput(input)

          startApp()
        }
      )
    }
  )
}

startApp()
