"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Get one array that consists of all values from the array for instance [1, 2, [3], [4, 5, [6]], 7].
function flattenArray(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            // If the element is an array, recursively flatten it
            result = result.concat(flattenArray(arr[i]));
        }
        else {
            // If the element is not an array, add it to the result
            result.push(arr[i]);
        }
    }
    return result;
}
var arr = [1, 2, [3], [4, 5, [6]], 7];
var flattenedArr = flattenArray(arr); //[ 1, 2, 3, 4, 5, 6, 7 ]
var arr1 = [1, [2, [[[[9]]]]], [3], [4, 5, [6]], 7];
var flattenedArr1 = flattenArray(arr1); //[ 1, 2, 9, 3, 4, 5, 6, 7 ]
console.log(flattenedArr, flattenedArr1);
