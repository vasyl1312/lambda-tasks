interface Array<T> {
  multiply(factor?: number): number[]
  associateBy(keySelector: (element: T) => string): { [key: string]: T[] }
  average(): number
  chunked(size: number): T[][]
  distinctBy<K>(selector: (element: T) => K): T[]
  filter(predicate: (element: T) => boolean): T[]
  filterIndexed(predicate: (index: number, element: T) => boolean): T[]
  filterNot(predicate: (element: T) => boolean): T[]
  find(predicate: (element: T) => boolean): T | undefined
  findLast(predicate: (element: T) => boolean): T | undefined
  flatten(): T[] //якщо треба усі зліпити:  interestingTasks\3flattenArray.ts
  fold<U>(initialValue: U, operation: (accumulator: U, element: T) => U): U ////////////////
  maxBy<K>(selector: (element: T) => K): T | undefined
  minBy<K>(selector: (element: T) => K): T | undefined
  count(selector: (element: T) => boolean): number
  groupBy<K>(keySelector: (element: T) => K): { [key: string]: T[] }
  groupBy<K, V>(
    keySelector: (element: T) => K,
    valueTransform: (element: T) => V
  ): { [key: string]: V[] }
  all(predicate: (element: T) => boolean): boolean
  any(predicate: (element: T) => boolean): boolean
}

const arrayOfNumbers = [1, 2, 3, 4, 5]
const persons = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'John' },
]

////////////////////////////////////////// multiply
Array.prototype.multiply = function (factor?: number): number[] {
  const multiplier = factor || 10 //якщо нема значення

  const multipliedArray: number[] = []
  for (let i = 0; i < this.length; i++) {
    multipliedArray.push(this[i] * multiplier)
  }
  return multipliedArray
}
console.log(arrayOfNumbers.multiply(2)) // [2, 4, 6, 8, 10]
console.log(arrayOfNumbers.multiply()) // [10, 20, 30, 40, 50]

//////////////////////////////////////////  associateBy
Array.prototype.associateBy = function <T>(keySelector: (element: T) => string): {
  [key: string]: T[]
} {
  const groupedData: { [key: string]: T[] } = {}

  for (const element of this) {
    const key = keySelector(element)
    if (!(key in groupedData)) {
      groupedData[key] = []
    }
    groupedData[key].push(element)
  }

  return groupedData
}

const data = [
  { emoji: '😀', sad: false },
  { emoji: '🥲', sad: true },
]
const groupedBySadness = data.associateBy((entry) => (entry.sad ? 'sad' : 'happy'))
console.log(groupedBySadness)
// {
//   happy: [{ emoji: "😀", sad: false }],
//   sad: [{ emoji: "🥲", sad: true }]
// }

//////////////////////////////////////////  average
Array.prototype.average = function (): number {
  if (this.length === 0) return 0
  const sum = this.reduce((acc: number, val: number) => acc + val, 0)
  return sum / this.length
}

const avg = arrayOfNumbers.average()
console.log(avg) // 3

////////////////////////////////////////// chunked
Array.prototype.chunked = function (size: number): any[][] {
  const result: any[][] = []
  for (let i = 0; i < this.length; i += size) {
    result.push(this.slice(i, i + size))
  }
  return result
}

const array = [1, 2, 3, 4, 5, 6, 7, 8]
const chunkedArray = array.chunked(3)
console.log(chunkedArray) // [[1, 2, 3], [4, 5, 6], [7, 8]]

//////////////////////////////////////////  distinctBy
Array.prototype.distinctBy = function <K>(selector: (element: any) => K): any[] {
  const result: any[] = []
  const keys = new Set()
  for (let i = 0; i < this.length; i++) {
    const key = selector(this[i])
    if (!keys.has(key)) {
      keys.add(key)
      result.push(this[i])
    }
  }
  return result
}

const distinctPersons = persons.distinctBy((person) => person.name)
console.log(distinctPersons)
// [
//   { id: 1, name: "John" },
//   { id: 2, name: "Jane" }
// ]

//////////////////////////////////////////  filter
Array.prototype.filter = function (
  predicate: (value: any, index: number, obj: any[]) => boolean,
  thisArg?: any
): any[] {
  const filteredArray: any[] = []
  for (let i = 0; i < this.length; i++) {
    if (predicate.call(thisArg, this[i], i, this)) {
      filteredArray.push(this[i])
    }
  }
  return filteredArray
}

const evenNumbers = arrayOfNumbers.filter((num) => num % 2 === 0)
console.log(evenNumbers) // [2, 4]

//////////////////////////////////////////  filterIndexed
Array.prototype.filterIndexed = function (
  predicate: (index: number, element: any) => boolean
): any[] {
  const result: any[] = []
  for (let i = 0; i < this.length; i++) {
    if (predicate(i, this[i])) {
      result.push(this[i])
    }
  }
  return result
}

const filteredNumbers = arrayOfNumbers.filterIndexed((index, num) => index % 2 === 0 && num > 2)
console.log(filteredNumbers) // [3, 5]

///////////////////////////////////////// / filterNot
Array.prototype.filterNot = function (predicate: (element: any) => boolean): any[] {
  const result: any[] = []
  for (let i = 0; i < this.length; i++) {
    if (!predicate(this[i])) {
      result.push(this[i])
    }
  }
  return result
}

const oddNumbers = arrayOfNumbers.filterNot((num) => num % 2 === 0)
console.log(oddNumbers) // [1, 3, 5]

//////////////////////////////////////////  find
Array.prototype.find = function (
  predicate: (value: any, index: number, obj: any[]) => boolean,
  thisArg?: any
): any {
  for (let i = 0; i < this.length; i++) {
    if (predicate.call(thisArg, this[i], i, this)) {
      return this[i]
    }
  }
  return undefined
}
const foundNumber = arrayOfNumbers.find((num) => num > 3)
console.log(foundNumber) // 4

//////////////////////////////////////////  findLast
Array.prototype.findLast = function (predicate: (element: any) => boolean): any | undefined {
  for (let i = this.length - 1; i >= 0; i--) {
    if (predicate(this[i])) {
      return this[i]
    }
  }
  return undefined
}

const lastFoundNumber = arrayOfNumbers.findLast((num) => num > 3)
console.log(lastFoundNumber) // 5

///////////////////////////////////////// / flatten
Array.prototype.flatten = function (): any[] {
  return this.reduce((acc: any[], val: number) => acc.concat(val), [])
}

const nestedArray = [
  [1, 2],
  [3, 4],
  [5, 6],
]
const flattenedArray = nestedArray.flatten()
console.log(flattenedArray) // [1, 2, 3, 4, 5, 6]

///////////////////////////////////////// / fold
Array.prototype.fold = function <U>(
  initialValue: U,
  operation: (accumulator: U, element: any) => U
): U {
  let accumulator = initialValue
  for (let i = 0; i < this.length; i++) {
    accumulator = operation(accumulator, this[i])
  }
  return accumulator
}

const sum = arrayOfNumbers.fold(0, (acc, num) => acc + num)
console.log(sum) // 15

//////////////////////////////////////////  maxBy
Array.prototype.maxBy = function <K>(selector: (element: any) => K): any | undefined {
  if (this.length === 0) return undefined
  let maxElement = this[0]
  let maxValue = selector(maxElement)
  for (let i = 1; i < this.length; i++) {
    const value = selector(this[i])
    if (value > maxValue) {
      maxElement = this[i]
      maxValue = value
    }
  }
  return maxElement
}

const personsWithAge = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 28 },
]
const oldestPerson = personsWithAge.maxBy((person) => person.age)
console.log(oldestPerson) // { id: 2, name: "Jane", age: 30 }

//////////////////////////////////////////  minBy
Array.prototype.minBy = function <K>(selector: (element: any) => K): any | undefined {
  if (this.length === 0) return undefined
  let minElement = this[0]
  let minValue = selector(minElement)
  for (let i = 1; i < this.length; i++) {
    const value = selector(this[i])
    if (value < minValue) {
      minElement = this[i]
      minValue = value
    }
  }
  return minElement
}

const youngestPerson = personsWithAge.minBy((person) => person.age)
console.log(youngestPerson) // { id: 1, name: "John", age: 25 }

//////////////////////////////////////////  count (with selector)
Array.prototype.count = function <T>(predicate: (element: T) => boolean): number {
  let count = 0
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i])) {
      count++
    }
  }
  return count
}

const objects = [{ population: 100 }, { population: 200 }, { population: 300 }]
const totalPopulation = objects.count((obj) => obj.population > 150)
console.log(totalPopulation) // 2

////////////////////////////////////////// groupBy
Array.prototype.groupBy = function <K extends string | number, V>(
  keySelector: (element: any) => K,
  valueTransform?: (element: any) => V
): { [key in K]: V[] } {
  const result: { [key in K]: V[] } = {} as { [key in K]: V[] }
  for (let i = 0; i < this.length; i++) {
    const key = keySelector(this[i])
    if (!result[key]) {
      result[key] = []
    }
    if (valueTransform) {
      result[key].push(valueTransform(this[i]))
    } else {
      result[key].push(this[i])
    }
  }
  return result
}

const groupedByName = persons.groupBy((person) => person.name)
console.log(groupedByName)
// {
//   'John': [
//     { id: 1, name: 'John' },
//     { id: 3, name: 'John' }
//   ],
//   'Jane': [
//     { id: 2, name: 'Jane' }
//   ]
// }

const groupedById = persons.groupBy(
  (person) => person.name,
  (person) => person.id
)
console.log(groupedById)
// {
//   'John': [1, 3],
//   'Jane': [2]
// }

//////////////////////////////////////////  all
Array.prototype.all = function (predicate: (element: any) => boolean): boolean {
  for (let i = 0; i < this.length; i++) {
    if (!predicate(this[i])) {
      return false
    }
  }
  return true
}

const allGreaterThanZero = arrayOfNumbers.all((num) => num > 0)
console.log(allGreaterThanZero) // true

//////////////////////////////////////////  any
Array.prototype.any = function (predicate: (element: any) => boolean): boolean {
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i])) {
      return true
    }
  }
  return false
}

const hasEvenNumber = arrayOfNumbers.any((num) => num % 2 === 0)
console.log(hasEvenNumber) // true
