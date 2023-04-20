"use strict";
// // isPalindrom
Object.defineProperty(exports, "__esModule", { value: true });
var isPalindrome = function (str) {
    var cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Перевертаємо рядок
    var reversedStr = cleanedStr.split('').reverse().join('');
    // Порівнюємо оригінальний рядок з перевернутим рядком
    return cleanedStr === reversedStr;
};
console.log(isPalindrome('sdsdff')); //false
console.log(isPalindrome('abba')); //true
console.log(isPalindrome('abcdcba')); //true
