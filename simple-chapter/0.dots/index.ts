const dots = (str: string): string[] => {
  let res: string[] = [str[0]]

  for (let i = 1; i < str.length; i++) {
    const slice = res.slice()
    const copy = slice.map((value) => value + '.')
    res.push(...copy)
    res = res.map((value) => value + str[i])
  }

  return res
}

console.log(dots('dot'))
console.log(dots('dots'))
console.log(dots('docks'))
