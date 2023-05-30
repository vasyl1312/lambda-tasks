import express = require('express')
import * as cron from 'node-cron'
import { Request, Response } from 'express'
import axios from 'axios'
import { createPool, Pool, PoolConnection } from 'mysql2/promise'

const app = express()
app.use(express.json())

const pool: Pool = createPool({
  host: `localhost`,
  user: `root`,
  password: `Vasyl2002-`,
  database: `crypto`,
})

// Функція для отримання актуальної ціни криптовалюти з API бірж
async function getLatestCryptoPrice(symbol: string, market: string): Promise<number> {
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

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
