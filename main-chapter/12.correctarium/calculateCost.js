function calculateCost(language, mimetype, count) {
  let standardPricePerWord, standardWordsPerHour, minimumCost

  if (language === 'ua') {
    standardPricePerWord = 0.05
    standardWordsPerHour = 1333
    minimumCost = 50
  } else {
    standardPricePerWord = 0.12
    standardWordsPerHour = 333
    minimumCost = 120
  }

  const maxWordsPerDocument = 10000
  let minimumTimeInMinutes = 60
  let pricePerWord = standardPricePerWord
  let wordsPerHour = standardWordsPerHour
  let wordsCount = Math.min(count, maxWordsPerDocument)

  if (mimetype !== 'doc' && mimetype !== 'docx' && mimetype !== 'rtf' && mimetype !== 'none') {
    pricePerWord += pricePerWord * 0.2
    wordsPerHour += Math.floor(wordsPerHour * 0.2)
    minimumCost += minimumCost * 0.2
    minimumTimeInMinutes += minimumTimeInMinutes * 0.2
  }
  const timeInMinutes = Math.max(30 + (wordsCount / wordsPerHour) * 60, minimumTimeInMinutes)
  let price = wordsCount * pricePerWord

  if (price < minimumCost) {
    price = minimumCost
  }

  const deadlineDate = getDeadlineDate(timeInMinutes)
  let roundedNum = Math.round((timeInMinutes / 60) * 10) / 10

  return {
    price,
    time: roundedNum,
    deadline: Math.floor(deadlineDate.getTime() / 1000),
    deadline_date: deadlineDate.toLocaleString(),
  }
}

function getDeadlineDate(timeInMinutes) {
  const currentDate = new Date()
  console.log(currentDate)
  let currentDay = currentDate.getDay()
  let currentHour = currentDate.getHours()
  const currentMinute = currentDate.getMinutes()

  // If it's the weekend or outside of working hours, set the deadline to 10:00 on the next workday
  if (currentDay === 6 || currentDay === 0 || currentHour < 10 || currentHour >= 19) {
    if (currentHour >= 19) {
      currentDay++
    }
    currentDay = currentDay === 6 ? 1 : currentDay + 1
    currentHour = 10
    currentDate.setHours(currentHour, 0, 0, 0)
  }

  const remainingMinutes = (19 - currentHour) * 60 - currentMinute
  const remainingTime = timeInMinutes - remainingMinutes

  // If there is remaining time after 19:00, add extra days
  if (remainingTime > 0) {
    let extraDays = Math.floor(remainingTime / (8 * 60)) // 8 work hours per day

    if (remainingTime % (8 * 60) > 0) {
      extraDays++
    }

    currentDay += extraDays
  }

  currentDate.setHours(19 + Math.floor((timeInMinutes - remainingMinutes) / 60))
  currentDate.setMinutes((remainingMinutes + timeInMinutes) % 60)
  currentDate.setDate(
    currentDate.getDate() + (currentHour >= 19 ? 1 : 0) + (currentDay - currentDate.getDay())
  )

  return currentDate
}

module.exports = calculateCost
