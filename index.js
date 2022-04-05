const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const index = require('./router/index')
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

app.use('/', index)

httpServer.listen()
