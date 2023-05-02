const calculateCost = require('./calculateCost')

describe('calculateCost', () => {
  test('calculateCost function should return the correct output with valid input', () => {
    const language = 'en'
    const mimetype = 'doc'
    const count = 5000

    const result = calculateCost(language, mimetype, count)

    expect(result).toEqual({
      price: 600,
      time: 15.5,
      deadline: expect.any(Number),
      deadline_date: expect.any(String),
    })
  })

  test('calculateCost function should return the correct output with the maximum words count', () => {
    const language = 'ua'
    const mimetype = 'docx'
    const count = 10000

    const result = calculateCost(language, mimetype, count)

    expect(result).toEqual({
      price: 500,
      time: 8,
      deadline: expect.any(Number),
      deadline_date: expect.any(String),
    })
  })

  test('calculateCost function should return the correct output with a mimetype not supported', () => {
    const language = 'en'
    const mimetype = 'pdf'
    const count = 100

    const result = calculateCost(language, mimetype, count)

    expect(result).toEqual({
      price: 144,
      time: 1.2,
      deadline: expect.any(Number),
      deadline_date: expect.any(String),
    })
  })

  test('calculateCost function should return the minimum cost when the calculated price is smaller than the minimum cost', () => {
    const language = 'ua'
    const mimetype = 'rtf'
    const count = 10

    const result = calculateCost(language, mimetype, count)

    expect(result).toEqual({
      price: 50,
      time: 1,
      deadline: expect.any(Number),
      deadline_date: expect.any(String),
    })
  })
})
