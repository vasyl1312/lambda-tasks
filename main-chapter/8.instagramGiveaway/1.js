const fs = require('fs')

function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

// async function uniqueValues() {
//   const uniqueUsernames = new Set()
//   for (let i = 0; i <= 19; i++) {
//     const data = await readFile(`./test/out${i}.txt`)
//     // const data = await readFile(`./files/out${i}.txt`)
//     const usernames = data.trim().split('\n')
//     for (const username of usernames) {
//       uniqueUsernames.add(username)
//     }
//   }

//   console.log(`Unique values: ${uniqueUsernames.size}`)
// }

async function existInAllFiles() {
  const wordsCounts = new Map()

  for (let i = 0; i <= 19; i++) {
    // const data = await readFile(`./test/out${i}.txt`)
    const data = await readFile(`./files/out${i}.txt`)
    const words = data.trim().split(/\s+/) // Розбиваємо текст на слова
    const uniqueWords = new Set(words)
    for (const word of uniqueWords) {
      if (!wordsCounts.has(word)) {
        wordsCounts.set(word, 1)
      } else {
        wordsCounts.set(word, wordsCounts.get(word) + 1)
      }
    }
  }

  // тут можна обійтись і однією функцією щоб зекономити час, проте в умові сказано що має бути 3 різні функції тоді треба розкоментувати інші функції
  let countTen = 0
  let count = 0
  let unique = wordsCounts.size
  for (const [word, occurrences] of wordsCounts.entries()) {
    if (occurrences > 10) {
      countTen++
    }
    if (occurrences === 20) {
      count++
    }
  }

  console.log(`Count values, which exist in all files: ${count} `)
  console.log(`Count values, which exist at least in ten files: ${countTen}`)
  console.log(`Unique values  : ${unique}`)
}

//якщо використовувати 3 різні функції як за умовою
// async function existInAtLeastTen() {
//   const wordsCounts = new Map()

//   for (let i = 0; i <= 19; i++) {
//     // const data = await readFile(`./test/out${i}.txt`)
//     const data = await readFile(`./files/out${i}.txt`)
//     const words = data.trim().split(/\s+/) // Розбиваємо текст на слова
//     const uniqueWords = new Set(words)
//     for (const word of uniqueWords) {
//       if (!wordsCounts.has(word)) {
//         wordsCounts.set(word, 1)
//       } else {
//         wordsCounts.set(word, wordsCounts.get(word) + 1)
//       }
//     }
//   }

//   let count = 0
//   for (const [word, occurrences] of wordsCounts.entries()) {
//     if (occurrences > 10) {
//       count++
//     }
//   }
//   console.log(`Count values, which exist at least in ten files: ${count}`)
// }

const fileStartTime = new Date()

Promise.all([existInAllFiles()]) // ,existInAtLeastTen(), uniqueValues()
  .then(() => {
    const fileEndTime = new Date()
    const fileExecutionTime = fileEndTime - fileStartTime
    console.log(`Execution time: ${fileExecutionTime} ms`)
  })
  .catch((error) => {
    console.error(`Error: ${error}`)
  })

// 200k                2mln         якщо використовувати лише одну функцію на 2mln
// 602ms               4114 ms      1260 ms

// 9603                129240
// uniqueValues

// 24                  441
// existInAllFiles

// 8110                55570
// existInAtLeastTen
