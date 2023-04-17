import inquirer from 'inquirer'
import fs from 'fs'
import mime from 'mime-types'
import 'dotenv/config'
import { google } from 'googleapis'
import axios from 'axios'

const GOOGLE_API_FOLDER_ID = `${process.env.GOOGLE_API_FOLDER_ID}`

async function uploadFile() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './key.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    })

    const driveService = google.drive({
      version: 'v3',
      auth,
    })

    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg']

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Please enter a file path: ',
        validate: (value) => {
          const mimeType = mime.lookup(value)
          if (mimeType && allowedMimeTypes.includes(mimeType)) {
            return true
          }
          return `Allowed types extensions: ${allowedMimeTypes.join(', ')}`
        },
      },
      {
        type: 'confirm',
        name: 'changeFileName',
        message: 'Do you want to change the name of file?',
      },
      {
        type: 'input',
        name: 'newFileName',
        message: "Введіть нове ім'я файлу without extensions like .jpg, .png etc. :",
        when: (answers) => answers.changeFileName,
      },
    ])

    let name
    if (answers.changeFileName) {
      name = answers.newFileName
    }

    const fileMetaData = {
      name: name,
      parents: [GOOGLE_API_FOLDER_ID],
    }

    const media = {
      mimeType: allowedMimeTypes.includes(mime.lookup(answers.filePath))
        ? mime.lookup(answers.filePath)
        : 'application/octet-stream',
      body: fs.createReadStream(answers.filePath),
    }

    const response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      field: 'id',
    })

    return response.data.id
  } catch (err) {
    console.log('Upload file error', err)
  }
}

uploadFile().then((data) => {
  async function shortenUrl(longUrl) {
    try {
      const apiKey = `${process.env.TINY_API}`
      const apiUrl = 'https://tinyurl.com/api-create.php'

      const response = await axios.get(apiUrl, {
        params: {
          api_key: apiKey,
          url: longUrl,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      return response.data
    } catch (err) {
      console.log('Shorten URL error', err)
    }
  }

  const googleDriveUrl = `https://drive.google.com/uc?export=view&id=${data}`
  shortenUrl(googleDriveUrl)
    .then((data) => {
      console.log('Short URL:', data)
    })
    .catch((err) => {
      console.error(err)
    })
})
