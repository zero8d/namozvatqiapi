const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const api = require('./router/api.js')
const http = require('http')
const app = express()
const httpServer = http.createServer(app)
const connectionString = process.env.CONNECTION_STRING

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

app.get('/', res => {
  res.send(
    "Welcome to our API checkout our <a href='https://t.me/muslimtaqvimapi'> Telegram Channel </a><br/>"
  )
})
app.use('/api', api)

httpServer.listen(3000)
