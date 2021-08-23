require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const connectionString = process.env.CONNECTION_STRING
const port = process.env.PORT
const TaqvimModel = require("./models/taqvim")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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
  if (!req.body.region && !req.query.region) {
    res.status(403)
    return res.json({
      status: "error",
      message: "Bad request. You must provide region value",
    })
  }
  if (!req.body.month && !req.query.month) {
    res.status(403)
    return res.json({
      status: "error",
      message: "Bad request. You must provide valid month value",
    })
  }
  let region = req.body.region ?? req.query.region
  let month = req.body.month ?? req.query.month
  region = capitalize(region)
  month = Number(month)
  const resData = await TaqvimModel.find(
    { region: region, month: month },
    { _id: 0, __v: 0 }
  )
  res.json(resData)
})

app.get("/api/daily", async (req, res) => {
  if (
    (!req.body.region && !req.query.region) ||
    (!req.body.month && !req.query.month) ||
    (!req.body.day && !req.query.day)
  ) {
    res.status(403)
    return res.send(
      "You must provide valid region and month value on json/www-url-encoded request body or in query"
    )
  }
  let region = req.body.region ?? req.query.region
  let month = req.body.month ?? req.query.month
  let day = req.body.day ?? req.query.day
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
