//5. Check if any anagram of a string is palindrome or not
var isAnagramtoPalindrome = function (str) {
    var charStr = str.toLowerCase().split('');
    var checked = '';
    for (var _i = 0, charStr_1 = charStr; _i < charStr_1.length; _i++) {
        var char = charStr_1[_i];
        if (checked.includes(char)) {
            checked = checked.replace(char, '');
        }
        else {
            checked += char;
        }
    }
    if (checked.length < 2)
        return true;
    return false;
};
console.log(isAnagramtoPalindrome('rpypyl')); //false
console.log(isAnagramtoPalindrome('olexaloxe')); //true
console.log(isAnagramtoPalindrome('forof')); //true
/////////////////////////////////////////////////////////////////////////////////////////
var isAnagramToPalindrome = function (str) {
    var charStr = str.toLowerCase().split('');
    var checked = new Set();
    for (var _i = 0, charStr_2 = charStr; _i < charStr_2.length; _i++) {
        var char = charStr_2[_i];
        if (checked.has(char)) {
            checked.delete(char);
        }
        else {
            checked.add(char);
        }
    }
    if (checked.size < 2)
        return true;
    return false;
};
console.log(isAnagramToPalindrome('rpypyl')); // false
console.log(isAnagramToPalindrome('olexaloxe')); // true
console.log(isAnagramToPalindrome('forof')); // true
