import * as express from 'express'
import * as bodyParser from 'body-parser'
const port: number = 3000

const app = express()
app.use(bodyParser.json())

interface DataStore {
  [key: string]: unknown
}

const dataStore: DataStore = {}

app.post('/:route', (req: express.Request, res: express.Response) => {
  const { route } = req.params
  const { body } = req
  dataStore[route] = body
  res.send(`Data saved successfully\nGo to route: 'http://localhost:${port}/${route}'`)
})

app.get('/:route', (req: express.Request, res: express.Response) => {
  const { route } = req.params
  const data = dataStore[route]
  if (data) {
    res.json(data)
  } else {
    res.status(404).send('Data not found')
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
