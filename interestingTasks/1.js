// Is anagram?   str1 to str2
function isAnagram(str1, str2) {
    var cleanedStr1 = str1.toLowerCase().split('');
    var cleanedStr2 = str2.toLowerCase().split('');
    if (cleanedStr1.length !== cleanedStr2.length)
        return false;
    // Перебираємо другий рядок і перевіряємо наявність кожного символу в першому рядку
    for (var _i = 0, cleanedStr2_1 = cleanedStr2; _i < cleanedStr2_1.length; _i++) {
        var char = cleanedStr2_1[_i];
        var index = cleanedStr1.indexOf(char);
        if (index === -1) {
            return false; // Якщо символ не знайдено в першому рядку, то рядки не є анаграмами
        }
        cleanedStr1.splice(index, 1); // Видаляємо знайдений символ з першого рядка, щоб уникнути повторного використання
    }
    return true;
}
console.log(isAnagram('Listen', 'silent')); //  true
console.log(isAnagram('abba', 'bbaa')); //  true
console.log(isAnagram('abbva', 'bbbaa')); //  false
