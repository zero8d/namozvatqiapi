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
  let { region, month } = req.body
  if (!region || !month) {
    res.status(403)
    res.json({ message: "Bad request" })
    return
  }
  let region = capitalize(region)
  month = Number(month)
  const resData = await TaqvimModel.find(
    { region: region, month: month },
    { _id: 0, __v: 0 }
  )
  res.json(resData)
})

app.get("/api/daily", async (req, res) => {
  let { region, month, day } = req.body

  if (!region || !month || !day) {
    res.status(403)
    res.json({ message: "Bad request" })
    return
  }
  month = Number(month)
  day = Number(day)
  region = capitalize(region)
  const resData = await TaqvimModel.findOne(
    { region, month, day },
    { _id: 0, __v: 0 }
  )
  res.json(resData)
})

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

app.listen(port)
