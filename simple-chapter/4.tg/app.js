const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
require('dotenv').config()

const token = `${process.env.TOKEN}`
const urlRandomPhoto = 'https://picsum.photos/200/300'
const bot = new TelegramBot(token, { polling: true })

console.log('TelegramBot successfully started...')

bot.on('message', async (msg) => {
  console.log(`Received message from ${msg.chat.username}: ${msg.text}`)

  if (msg.text.includes('photo')) {
    try {
      const response = await axios.get(urlRandomPhoto, { responseType: 'stream' })
      console.log(`Received picture from ${urlRandomPhoto}`)

      bot.sendPhoto(msg.chat.id, response.data)
    } catch (error) {
      console.error(error)
    }
  } else {
    bot.sendMessage(msg.chat.id, `You wrote: ${msg.text}`)
  }
})
