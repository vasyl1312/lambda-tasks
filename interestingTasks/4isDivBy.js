// If a number is divisible by 2: output 'fiz' if by 3: 'baz', if by 2 and 3:'fizbaz'
var isDivisibleBy = function (n) {
    var result = '';
    if (n % 2 === 0)
        result += 'fiz';
    if (n % 3 === 0)
        result += 'baz';
    return result;
};
console.log(isDivisibleBy(0), isDivisibleBy(8), isDivisibleBy(9)); //fizbaz fiz baz
