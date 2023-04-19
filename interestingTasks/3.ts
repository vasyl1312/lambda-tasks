// Get one array that consists of all values from the array for instance [1, 2, [3], [4, 5, [6]], 7].
function flattenArray(arr: any[]): any[] {
  let result: any[] = []

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // If the element is an array, recursively flatten it
      result = result.concat(flattenArray(arr[i]))
    } else {
      // If the element is not an array, add it to the result
      result.push(arr[i])
    }
  }

  return result
}

const arr: any[] = [1, 2, [3], [4, 5, [6]], 7]
const flattenedArr: any[] = flattenArray(arr) //[ 1, 2, 3, 4, 5, 6, 7 ]

const arr1: any[] = [1, [2, [[[[9]]]]], [3], [4, 5, [6]], 7]
const flattenedArr1: any[] = flattenArray(arr1) //[ 1, 2, 9, 3, 4, 5, 6, 7 ]

console.log(flattenedArr, flattenedArr1)

export {}
