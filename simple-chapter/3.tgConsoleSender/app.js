const TelegramBot = require('node-telegram-bot-api')
const commander = require('commander')
require('dotenv').config()

const botToken = `${process.env.TOKEN}`
const chatId = `${process.env.USER_ID}`
const bot = new TelegramBot(botToken)

commander
  .command('m <text>')
  .description('Send a message to Telegram bot')
  .action((text) => {
    bot.sendMessage(chatId, text)
  })

commander
  .command('p <path>')
  .description('Send a photo to Telegram bot')
  .action((path) => {
    bot.sendPhoto(chatId, path)
  })

commander.parse(process.argv)
