// // isPalindrom

const isPalindrome = (str: string): boolean => {
  const cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '')

  // Перевертаємо рядок
  const reversedStr = cleanedStr.split('').reverse().join('')

  // Порівнюємо оригінальний рядок з перевернутим рядком
  return cleanedStr === reversedStr
}

console.log(isPalindrome('sdsdff')) //false
console.log(isPalindrome('abba')) //true
console.log(isPalindrome('abcdcba')) //true

export {}
