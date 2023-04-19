//5. Check if any anagram of a string is palindrome or not

const isAnagramtoPalindrome = (str: string): boolean => {
  const charStr = str.toLowerCase().split('')
  let checked = ''
  for (let char of charStr) {
    if (checked.includes(char)) {
      checked = checked.replace(char, '')
    } else {
      checked += char
    }
  }

  if (checked.length < 2) return true

  return false
}

console.log(isAnagramtoPalindrome('rpypyl')) //false
console.log(isAnagramtoPalindrome('olexaloxe')) //true
console.log(isAnagramtoPalindrome('forof')) //true

/////////////////////////////////////////////////////////////////////////////////////////
const isAnagramToPalindrome = (str: string): boolean => {
  const charStr = str.toLowerCase().split('')
  let checked = new Set()
  for (let char of charStr) {
    if (checked.has(char)) {
      checked.delete(char)
    } else {
      checked.add(char)
    }
  }

  if (checked.size < 2) return true

  return false
}

console.log(isAnagramToPalindrome('rpypyl')) // false
console.log(isAnagramToPalindrome('olexaloxe')) // true
console.log(isAnagramToPalindrome('forof')) // true
