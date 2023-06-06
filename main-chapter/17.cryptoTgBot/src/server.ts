import express = require('express')
import * as cron from 'node-cron'
import { Request, Response } from 'express'
import axios from 'axios'
import { createPool, Pool, PoolConnection, RowDataPacket } from 'mysql2/promise'
import TelegramBot = require('node-telegram-bot-api')
import { InlineKeyboardButton, AnswerCallbackQueryOptions } from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/.env' })
require('dotenv').config({ path: __dirname + '/.env' })

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

const pool: Pool = createPool({
  host: `${process.env.DB_HOST}`,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
})

const botToken = `${process.env.TG_TOKEN}`
const bot = new TelegramBot(botToken, { polling: true })

async function getLatestCryptoPrice(symbol: string, market: string): Promise<number> {
  // Код для отримання актуальної ціни криптовалюти з API бірж
  let apiUrl = ''
  let price = 0

  switch (market) {
    case 'CoinBase':
      apiUrl = `https://api.coinbase.com/v2/prices/${symbol}-USD/buy`
      break
    case 'CoinStats':
      apiUrl = `https://api.coinstats.app/public/v1/coins`
      break
    case 'Kucoin':
      apiUrl = `https://api.kucoin.com/api/v1/market/allTickers`
      break
    case 'CoinPaprika':
      apiUrl = `https://api.coinpaprika.com/v1/tickers`
      break
    default:
      throw new Error('Invalid market')
  }

  try {
    const response = await axios.get(apiUrl)

    switch (market) {
      case 'CoinBase':
        price = parseFloat(response.data.data.amount)
        break

      case 'CoinStats':
        const foundCoinStats = {
          data: {
            coins: response.data.coins.filter((obj: { symbol: string }) => obj.symbol === symbol),
          },
        }

        price = parseFloat(foundCoinStats.data.coins[0].price)
        break

      case 'Kucoin':
        const foundKucoin = {
          data: {
            time: response.data.data.time,
            ticker: response.data.data.ticker.filter(
              (obj: { symbol: string }) => obj.symbol === `${symbol}-USDT`
            ),
          },
        }

        price = parseFloat(foundKucoin.data.ticker[0].averagePrice)
        break

      case 'CoinPaprika':
        const foundCoinPaprika = response.data.reduce((res: any, obj: any) => {
          if (obj.symbol === symbol) {
            res.push(obj)
          }
          return res
        }, [])

        price = foundCoinPaprika[0].quotes.USD.price
        break
    }
  } catch (error) {
    console.error(`Failed to fetch price from ${market}:`, error)
  }

  return price
}

// Функція для збереження ціни криптовалюти в базу даних
async function saveCryptoPrice(
  connection: PoolConnection,
  symbol: string,
  market: string,
  price: number,
  timestamp: Date
): Promise<void> {
  const insertQuery =
    'INSERT INTO crypto_prices (symbol, market, price, timestamp) VALUES (?, ?, ?, ?)'
  await connection.execute(insertQuery, [symbol, market, price, timestamp])
}

// Підключення до бази даних MySQL та створення таблиці, якщо вона не існує
;(async () => {
  try {
    const connection: PoolConnection = await pool.getConnection()

    // Створення таблиці crypto_prices, якщо вона не існує
    await connection.query(`
      CREATE TABLE IF NOT EXISTS crypto_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        symbol VARCHAR(10) NOT NULL,
        market VARCHAR(20) NOT NULL,
        price DECIMAL(12, 2) NOT NULL,
        timestamp DATETIME NOT NULL
      )
    `)

    connection.release()
    console.log('Connected to MySQL database')
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error)
  }
})()

// CRON задача для отримання і зберігання актуальних цін криптовалют кожні 5 хвилин
cron.schedule('*/5 * * * *', async () => {
  const markets = ['CoinBase', 'CoinStats', 'Kucoin', 'CoinPaprika']
  const symbols = ['BTC', 'ETH', 'LTC']

  try {
    const connection: PoolConnection = await pool.getConnection()

    for (const symbol of symbols) {
      for (const market of markets) {
        const price = await getLatestCryptoPrice(symbol, market)
        const timestamp = new Date()
        await saveCryptoPrice(connection, symbol, market, price, timestamp)
      }
    }

    connection.release()
  } catch (error) {
    console.error('Failed to fetch or save crypto prices:', error)
  }
})

// Ендпоінт для отримання даних по криптовалютах
app.get('/cryptos', async (req: Request, res: Response) => {
  const symbol: string = <string>req.query.symbol
  const market: string | undefined = <string | undefined>req.query.market
  const period: string | undefined = <string | undefined>req.query.period

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol parameter' })
  }

  let whereClause: string = 'WHERE symbol = ?'
  const values: any[] = [symbol]

  if (market) {
    whereClause += ' AND market = ?'
    values.push(market)
  } else {
    //якщо нема маркета то шукаєм середнє
    const markets = ['CoinBase', 'CoinStats', 'Kucoin', 'CoinPaprika']
    let averagePrice = 0

    for (const market of markets) {
      const price = await getLatestCryptoPrice(symbol, market)
      averagePrice += price
    }

    averagePrice /= markets.length
    return res.json({ averagePrice })
  }

  // Визначення часових рамок для відображення даних
  const timeBoundary = new Date()
  switch (period) {
    case '15m':
      timeBoundary.setMinutes(timeBoundary.getMinutes() - 15)
      break
    case '1h':
      timeBoundary.setHours(timeBoundary.getHours() - 1)
      break
    case '4h':
      timeBoundary.setHours(timeBoundary.getHours() - 4)
      break
    case '24h':
      timeBoundary.setHours(timeBoundary.getHours() - 24)
      break
    default:
      timeBoundary.setHours(timeBoundary.getHours() - 24)
  }

  try {
    const connection: PoolConnection = await pool.getConnection()
    //відносно дати шукаємо дані
    let selectQuery = `
      SELECT *
      FROM crypto_prices
      ${whereClause} AND timestamp >= ?
      ORDER BY timestamp DESC
    `

    const [cryptoData] = await connection.execute(selectQuery, [...values, timeBoundary])
    connection.release()

    return res.json(cryptoData)
  } catch (error) {
    console.error('Failed to fetch crypto data from database:', error)
    return res.status(500).json({ error: 'Failed to fetch crypto data' })
  }
})

////////////////TASK 17//////////////////////// Telegram bot commands
// Обробка команди /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Привіт, ласкаво просимо! (Що вміє бот? /help )')
})

// Обробка команди /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  const helpMessage =
    'Ось список доступних команд:\n' +
    '/start - привітання\n' +
    '/help - довідка\n' +
    '/listRecent - список "хайпової" крипти\n' +
    '/listFavourite - список вибраних криптовалют'
  bot.sendMessage(chatId, helpMessage)
})

const markets = ['CoinBase', 'CoinStats', 'Kucoin', 'CoinPaprika']
const symbols = ['BTC', 'ETH', 'LTC']

// // Обробка команди /listRecent
bot.onText(/\/listRecent/, async (msg) => {
  const chatId = msg.chat.id

  const marketButtons = markets.map((market) => {
    return { text: market, callback_data: `market_${market}` }
  })

  const symbolButtons = symbols.map((symbol) => {
    return { text: symbol, callback_data: `symbol_${symbol}` }
  })

  const keyboard: InlineKeyboardButton[][] = [marketButtons, symbolButtons]

  bot.sendMessage(chatId, 'Виберіть ринок та символ:', {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  })
})

bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id
  const data = query.data

  if (!data || !chatId) {
    console.error('Помилка: data or chatId є undefined.')
    return
  }

  if (data.startsWith('market_')) {
    const market = data.replace('market_', '')
    const symbolButtons = symbols.map((symbol) => {
      return { text: symbol, callback_data: `symbol_${symbol}_${market}` }
    })

    const keyboard: InlineKeyboardButton[][] = [symbolButtons]

    bot.sendMessage(chatId, `Виберіть символ для ринку ${market}:`, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    })
  } else if (data.startsWith('symbol_')) {
    const [symbol, market] = data.replace('symbol_', '').split('_')

    try {
      const response = await axios.get(
        `http://localhost:3000/cryptos?symbol=${symbol}&market=${market}`
      )
      const responseData = response.data

      if (responseData) {
        const items = responseData.map((crypto: any) => {
          const price = parseFloat(crypto.price).toFixed(2)
          return `/${crypto.symbol} $${price}`
        })

        const itemList = items.join('\n')
        bot.sendMessage(chatId, itemList)
      } else {
        bot.sendMessage(chatId, 'Отримано невідповідні дані від сервера.')
      }
    } catch (error) {
      console.error('Помилка отримання даних:', error)
      bot.sendMessage(chatId, 'Виникла помилка при отриманні даних. Спробуйте пізніше.')
    }
  }

  bot.answerCallbackQuery(query.id)
})

// Створення таблиці "favorites"
async function createFavoritesTable() {
  const connection = await pool.getConnection()
  try {
    await connection.query(
      'CREATE TABLE IF NOT EXISTS favorites (currency_symbol VARCHAR(10) NOT NULL PRIMARY KEY)'
    )
  } catch (error) {
    console.error('Помилка при створенні таблиці favorites:', error)
  } finally {
    connection.release()
  }
}

createFavoritesTable()

bot.onText(/\/(\w+)/, async (msg, match) => {
  const command = match && match[1] ? match[1].toUpperCase() : ''
  const symbols = ['BTC', 'ETH', 'LTC']

  if (symbols.includes(command)) {
    const currencySymbol = match && match[1] ? match[1].toUpperCase() : ''
    try {
      let reply = `Дані середньої ціни для криптовалюти: ${currencySymbol}\n`

      for (const market of markets) {
        const apiUrl = `http://localhost:3000/cryptos?symbol=${currencySymbol}&market=${market}`

        const response = await axios.get(apiUrl)
        const data = response.data

        // Фільтруємо дані, щоб врахувати тільки останні 24 години
        const last24HoursData = data.filter((item: any) => {
          const timestamp = new Date(item.timestamp).getTime()
          const currentTime = new Date().getTime()
          const timeDifferenceInHours = (currentTime - timestamp) / (1000 * 60 * 60)
          return timeDifferenceInHours <= 24
        })

        // Функція для обчислення середньої ціни за певний проміжок часу
        const calculateAveragePrice = (hours: number) => {
          const currentTime = new Date().getTime()
          const startTime = currentTime - hours * 60 * 60 * 1000
          const filteredData = last24HoursData.filter((item: any) => {
            const timestamp = new Date(item.timestamp).getTime()
            return timestamp >= startTime
          })

          if (filteredData.length === 0) {
            return null
          }

          const sum = filteredData.reduce((total: number, item: any) => {
            return total + parseFloat(item.price)
          }, 0)

          return sum / filteredData.length
        }

        // Виводимо середню ціну за кожен проміжок часу у годинах
        const timeIntervals = [0.5, 1, 3, 6, 12, 24]

        const output = timeIntervals.map((hours) => {
          const averagePrice = calculateAveragePrice(hours)
          const formattedPrice = averagePrice !== null ? averagePrice.toFixed(2) : 'Немає даних'
          return `За останні ${hours} год: ${formattedPrice}$`
        })

        // Формуємо рядок відповіді для кожного ринку
        reply += `${market}:\n`
        reply += output.join('\n')
        reply += '\n\n' // Додаємо перехід на новий рядок між ринками
      }
      // Створюємо інлайн кнопку "Add/Remove to/from following"
      const isFavorite = await checkIfCurrencyIsFavorite(currencySymbol)
      const buttonText = isFavorite ? 'Remove from following' : 'Add to following'
      const inlineKeyboard = [
        [{ text: buttonText, callback_data: `addToFavorite ${currencySymbol}` }],
      ]

      // Відправляємо повідомлення з результатами та інлайн кнопкою
      bot.sendMessage(msg.chat.id, reply, {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      })
    } catch (error) {
      console.error('Помилка запиту до сервера:', error)
      bot.sendMessage(msg.chat.id, 'Виникла помилка. Будь ласка, спробуйте пізніше.')
    }
  }
})

// Обробка вибору інлайн кнопки
bot.on('callback_query', async (query) => {
  if (query.data) {
    const { data, message } = query
    const [command, currencySymbol] = data.split(' ')

    if (command === 'addToFavorite') {
      const chatId = message?.chat.id || 0
      const isFavorite = await checkIfCurrencyIsFavorite(currencySymbol)

      if (isFavorite) {
        // Видалення крипти зі списку "улюблене"
        await removeCurrencyFromFavorites(chatId, currencySymbol)
        const answerOptions: AnswerCallbackQueryOptions = {
          callback_query_id: query.id,
          text: isFavorite ? 'Removed from following' : 'Added to following',
        }
        bot.answerCallbackQuery(answerOptions)
      } else {
        // Додавання крипти до списку "улюблене"
        await addCurrencyToFavorites(chatId, currencySymbol)
        const answerOptions: AnswerCallbackQueryOptions = {
          callback_query_id: query.id,
          text: 'Added to following',
        }
        bot.answerCallbackQuery(answerOptions)
      }
    }
  }
})

// Додавання крипти до списку "улюблене"
async function addCurrencyToFavorites(chatId: number, currencySymbol: string): Promise<void> {
  const connection = await pool.getConnection()
  try {
    const query = 'INSERT INTO favorites (currency_symbol) VALUES (?)'
    await connection.query(query, [currencySymbol])

    bot.sendMessage(chatId, `Криптовалюта ${currencySymbol} додана до списку улюблених. \n /help`)
  } catch (error) {
    console.error('Помилка при додаванні крипти до списку favorites:', error)
    throw error
  } finally {
    connection.release()
  }
}

// Видалення крипти зі списку "улюблене"
async function removeCurrencyFromFavorites(chatId: number, currencySymbol: string): Promise<void> {
  const connection = await pool.getConnection()
  try {
    const query = 'DELETE FROM favorites WHERE currency_symbol = ?'
    await connection.query(query, [currencySymbol])

    bot.sendMessage(chatId, `Криптовалюта ${currencySymbol} видалена зі списку улюблених. \n /help`)
  } catch (error) {
    console.error('Помилка при видаленні крипти зі списку favorites:', error)
    throw error
  } finally {
    connection.release()
  }
}

interface Currency {
  symbol: string
  price: string
}

// Обробка команди /listFavourite
bot.onText(/\/listFavourite/, async (msg) => {
  const chatId = msg.chat.id

  try {
    const favoriteCurrencies = await getFavoriteCurrencies()

    if (favoriteCurrencies.length > 0) {
      let response = ''

      for (const currency of favoriteCurrencies) {
        response += `/${currency.symbol} $${currency.price}\n`
      }

      bot.sendMessage(chatId, response)
    } else {
      bot.sendMessage(chatId, 'You have no favorite cryptocurrencies.')
    }
  } catch (error) {
    console.error('Error retrieving favorite cryptocurrencies:', error)
    bot.sendMessage(chatId, 'An error occurred while retrieving favorite cryptocurrencies.')
  }
})

// Перевірка, чи крипта є в списку "улюблене"
async function checkIfCurrencyIsFavorite(currencySymbol: string): Promise<boolean> {
  const connection = await pool.getConnection()

  try {
    const query = 'SELECT COUNT(*) AS count FROM favorites WHERE currency_symbol = ?'
    const [rows] = await connection.query<RowDataPacket[]>(query, [currencySymbol])
    const count = rows[0]?.count || 0

    return count > 0
  } catch (error) {
    console.error('Error checking if currency is favorite:', error)
    throw error
  } finally {
    connection.release()
  }
}

// Отримання улюблених криптовалют
async function getFavoriteCurrencies(): Promise<Currency[]> {
  const connection = await pool.getConnection()

  try {
    const query = 'SELECT * FROM favorites'
    const [rows] = await connection.query<RowDataPacket[]>(query)

    const favoriteCurrencies: Currency[] = []

    for (const row of rows) {
      const currencySymbol = row.currency_symbol
      const isFavorite = await checkIfCurrencyIsFavorite(currencySymbol)

      if (isFavorite) {
        const currencyData = await getCurrencyData(currencySymbol)
        favoriteCurrencies.push(currencyData)
      }
    }

    return favoriteCurrencies
  } catch (error) {
    console.error('Error retrieving favorite currencies:', error)
    throw error
  } finally {
    connection.release()
  }
}

// Отримання даних про криптовалюту
async function getCurrencyData(symbol: string): Promise<Currency> {
  const apiUrl = `http://localhost:3000/cryptos?symbol=${symbol}&market=CoinStats`

  try {
    const response = await axios.get(apiUrl)
    const responseData = response.data

    if (Array.isArray(responseData) && responseData.length > 0) {
      const currency = responseData[0]
      const price = parseFloat(currency.price).toFixed(2)

      return {
        symbol: currency.symbol,
        price: price,
      }
    } else {
      throw new Error('Invalid response data')
    }
  } catch (error) {
    console.error(`Error getting data for currency ${symbol}:`, error)
    throw error
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
//http://t.me/CryptoTSTelegramBot