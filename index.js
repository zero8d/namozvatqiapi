require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const connectionString = process.env.CONNECTION_STRING
const port = process.env.PORT
const TaqvimModel = require('./models/taqvim')
const app = express()
const { DateTime } = require('luxon')
const present = require('./Router/present')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

app.use('/api/present', present)

app.get('/', (req, res) => {
  res.send(
    "Welcome to our API checkout our <a href='https://t.me/muslimtaqvimapi'> Telegram Channel </a>"
  )
})

app.get('/api/monthly', async (req, res) => {
  if (!req.body.region && !req.query.region) {
    res.status(403)
    return res.json({
      status: 'error',
      message: 'Bad request. You must provide region value',
    })
  }
  if (!req.body.month && !req.query.month) {
    res.status(403)
    return res.json({
      status: 'error',
      message: 'Bad request. You must provide valid month value',
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

app.get('/api/weekly', async (req, res) => {
  if (
    (!req.body.region && !req.query.region) ||
    (!req.body.month && !req.query.month) ||
    (!req.body.from_day && !req.query.day)
  ) {
    res.status(403)
    return res.send(
      'You must provide valid region and month value on json/www-url-encoded request body or in query'
    )
  }
  let region = req.body.region ?? req.query.region
  let month = Number(req.body.month ?? req.query.month)
  let from_day = Number(req.body.from_day ?? req.query.from_day)
  let to_day = from_day + 7

  try {
    let data = await TaqvimModel.find(
      {
        region: region,
        $and: [
          {
            $and: [{ month: { $gte: month } }, { month: { $lte: month + 1 } }],
          },
          { $and: [{ day: { $gte: from_day } }, { day: { $lt: to_day } }] },
        ],
      },
      { _id: 0 }
    )
    res.json(data)
  } catch (err) {
    res.status(500)
    res.json(err.message)
  }
})

app.get('/api/thisweek', async (req, res) => {
  if (!req.body.region && !req.query.region) {
    res.status(403)
    return res.send(
      'You must provide valid region and month value on json/www-url-encoded request body or in query'
    )
  }
  let region = req.body.region ?? req.query.region
  let now = DateTime.now()
  let month = now.toObject().month
  let from_day = now.startOf('week').toObject().day
  let to_day = now.endOf('week').toObject().day

  try {
    let data = await TaqvimModel.find(
      {
        region: region,
        $and: [
          {
            $and: [{ month: { $gte: month } }, { month: { $lte: month + 1 } }],
          },
          { $and: [{ day: { $gte: from_day } }, { day: { $lt: to_day } }] },
        ],
      },
      { _id: 0 }
    )
    res.json(data)
  } catch (err) {
    res.status(500)
    res.json(err.message)
  }
})

app.get('/api/daily', async (req, res) => {
  if (
    (!req.body.region && !req.query.region) ||
    (!req.body.month && !req.query.month) ||
    (!req.body.day && !req.query.day)
  ) {
    res.status(403)
    return res.send(
      'You must provide valid region and month value on json/www-url-encoded request body or in query'
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
