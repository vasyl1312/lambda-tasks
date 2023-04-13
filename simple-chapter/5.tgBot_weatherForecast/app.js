const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const express = require('express')
require('dotenv').config()
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

const token = `${process.env.TOKEN}`
const bot = new TelegramBot(token, { polling: true })

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const userInput = msg.text

  if (userInput === '/start' || userInput === 'Return to menu') {
    bot.sendMessage(chatId, 'Hello! Welcome to the Weather Forecast and exchange currency Bot.\n', {
      reply_markup: {
        keyboard: [[{ text: 'Get Weather' }], [{ text: 'Currency' }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    })
    return
  }

  if (userInput === 'Get Weather') {
    bot.sendMessage(chatId, '\nPlease enter a city name.')
    bot.on('message', async (msg) => {
      const chatId = msg.chat.id
      const userInput = msg.text

      if (userInput === '3 hours' || userInput === '6 hours') {
      } else {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${process.env.WEATHER_KEY}`
          )

          const data = response.data
          var inp_city = data.name

          bot.sendMessage(chatId, `Select forecast interval for ${inp_city}:`, {
            reply_markup: {
              keyboard: [
                [{ text: '3 hours' }],
                [{ text: '6 hours' }],
                [{ text: 'Return to menu' }],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          })

          bot.once('message', async (msg) => {
            const chatId = msg.chat.id
            const userInput = msg.text
            var input_city = inp_city
            if (userInput === '3 hours' || userInput === '6 hours') {
              try {
                const interval = userInput === '3 hours' ? 3 : 6
                const response = await axios.get(
                  `https://api.openweathermap.org/data/2.5/forecast?q=${input_city}&appid=${process.env.WEATHER_KEY}`
                )

                const data = response.data
                const city = data.city.name
                const forecastList = data.list

                const daysOfWeek = [
                  'Sunday',
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ]

                const months = [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ]

                let message = `Weather forecast for ${city} every ${interval} hours:\n`
                let dataTemp = ''

                for (let i = 0; i < forecastList.length; i += interval / 3) {
                  const forecast = forecastList[i]

                  const dateTime = new Date(forecast.dt_txt)

                  const dayOfWeek = daysOfWeek[dateTime.getUTCDay()]
                  const dayOfMonth = dateTime.getUTCDate()
                  const month = months[dateTime.getUTCMonth()]
                  const hours = dateTime.getUTCHours()
                  const minutes = dateTime.getUTCMinutes()

                  const dataAll = `${dayOfWeek} ${dayOfMonth} ${month}`
                  if (dataAll != dataTemp) {
                    message += `\n\n${dataAll} \n`
                    dataTemp = dataAll
                  }

                  const formattedDateTime = `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}`

                  const weatherDescription = forecast.weather[0].description
                  const temperature = (forecast.main.temp - 273.15).toFixed(2)
                  const feels_like = (forecast.main.feels_like - 273.15).toFixed(2)
                  message += `${formattedDateTime}, \t${temperature}°C \tFeels like: ${feels_like}°C, \t${weatherDescription}\n`
                }

                bot.sendMessage(chatId, message)
              } catch (error) {
                bot.sendMessage(chatId, 'Error getting weather forecast.')
              }
            }
          })
        } catch (error) {
          bot.sendMessage(chatId, "City doesn't exist.")
        }
      }
    })
  } else if (userInput === 'Currency') {
    bot.sendMessage(chatId, 'Select currency', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '€ - EUR',
              callback_data: 'EUR',
            },
            {
              text: '$ - USD',
              callback_data: 'USD',
            },
          ],
        ],
      },
    })

    bot.on('callback_query', async (query) => {
      const id = query.message.chat.id

      try {
        const response = await axios.get(
          'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
        )

        const data = response.data
        const result = data.filter((item) => item.ccy === query.data)[0]
        const flag = {
          EUR: '🇪🇺',
          USD: '🇺🇸',
          UAH: '🇺🇦',
        }
        let md = `
      
        *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*
        Buy: _${result.buy}_
        Sale: _${result.sale}_
        \nJust press above to choose another currency
      `
        bot.sendMessage(id, md, { parse_mode: 'Markdown' })
      } catch (error) {
        bot.sendMessage(chatId, error)
      }
    })

    return
  } else {
    bot.sendMessage(chatId, '\nPlease select option in menu')
  }
})
