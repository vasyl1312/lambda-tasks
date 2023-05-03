const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let db

async function connect() {
  try {
    await client.connect()
    db = client.db(process.env.DB_NAME)

    console.log('Connected to the database!')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

connect()
app.use(express.json())

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401)
    }
    req.user = user
    next()
  })
}

//sign_up
app.post('/sign_up', async (req, res) => {
  const { email, password } = req.body

  if (!db) {
    return res.status(500).json({ message: 'Database connection failed' })
  }

  const existingUser = await db.collection('users').findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = {
    email,
    password: hashedPassword,
  }

  const result = await db.collection('users').insertOne(newUser)
  const user = { id: result.insertedId }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  await db.collection('refreshTokens').insertOne({ token: refreshToken })

  console.log('Account saved successfully')

  res.json({ accessToken, refreshToken })
})

//login
app.post('/login', async (req, res) => {
  const { email, password } = req.query

  const user = await db.collection('users').findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'Email or password is incorrect' })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return res.status(400).json({ message: 'Email or password is incorrect' })
  }

  const accessToken = generateAccessToken({ id: user._id })
  const refreshToken = generateRefreshToken({ id: user._id })

  await db.collection('refreshTokens').insertOne({ token: refreshToken })

  console.log(`Hello, ${email}`)
  res.json({ accessToken, refreshToken })
})

//refresh //postman header `..`
app.post('/refresh', async (req, res) => {
  const refreshToken = req.headers.authorization

  if (!refreshToken) {
    return res.sendStatus(401)
  }

  const existingToken = await db.collection('refreshTokens').findOne({ token: refreshToken })
  if (!existingToken) {
    return res.sendStatus(401)
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401)
    }

    const accessToken = generateAccessToken({ id: user.id })
    res.json({ accessToken })
  })
})

//me //postman auth
app.get('/me:queryNum', authenticateToken, async (req, res) => {
  const { queryNum } = req.params

  const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) })

  if (!user) {
    return res.sendStatus(401)
  }

  res.json({
    request_num: queryNum,
    data: {
      username: user.email,
    },
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
