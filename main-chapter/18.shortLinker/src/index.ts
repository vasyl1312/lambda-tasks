import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import validUrl from 'valid-url'
import crypto from 'crypto'

const port = 3000
const app = express()
app.use(bodyParser.json())

interface UrlDatabase {
  [key: string]: string
}

const urlDatabase: UrlDatabase = {}

function generateShortURL(url: string): string {
  const hash = crypto.createHash('md5').update(url).digest('hex')
  return hash.slice(0, 6)
}

app.post('/shorten', (req: Request, res: Response) => {
  const { link } = req.body

  if (!validUrl.isUri(link)) {
    return res.status(400).json('Invalid URL')
  }

  const shortURL = generateShortURL(link)
  urlDatabase[shortURL] = link

  res.json({ shortURL: `http://localhost:${port}/` + shortURL })
})

app.get('/:shortURL', (req: Request, res: Response) => {
  const { shortURL } = req.params

  if (shortURL in urlDatabase) {
    res.redirect(urlDatabase[shortURL])
  } else {
    res.status(404).json('Short URL not found')
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
