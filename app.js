require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const connectionString = process.env.CONNECTION_STRING
const port = process.env.PORT

const TaqvimModel = require("./models/taqvim")
const app = express()

app.use(express.json())

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

app.get("/", (req, res) => {
  res.send(
    "Welcome to our API checkout our <a href='https://t.me/muslimtaqvimapi'> Telegram Channel </a>"
  )
})

app.get("/api/monthly", async (req, res) => {
  const { region, month } = req.body
  if (!region || !month) {
    res.status(403)
    res.json({ message: "Bad request" })
    return
  }
  const resData = await TaqvimModel.find(
    { region: region, month: month },
    { _id: 0, __v: 0 }
  )
  res.json(resData)
})

app.get("/api/daily", async (req, res) => {
  const { region, month, day } = req.body
  if (!region || !month || !day) {
    res.status(403)
    res.json({ message: "Bad request" })
    return
  }
  const resData = await TaqvimModel.findOne(
    { region, month, day },
    { _id: 0, __v: 0 }
  )
  res.json(resData)
})

app.listen(port)
