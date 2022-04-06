const express = require('express')
const router = express.Router()
const TaqvimModel = require('../models/taqvim')

const { DateTime } = require('luxon')
router.get('/', (req, res) => {
  res.send(
    "Welcome to our API checkout our <a href='https://t.me/muslimtaqvimapi'> Telegram Channel </a><br/>"
  )
})
router.get('/monthly', async (req, res) => {
  if (!req.query.region) {
    res.status(403)
    return res.json({
      status: 'error',
      message: 'Bad request. You must provide region value',
    })
  }
  if (!req.query.month) {
    res.status(403)
    return res.json({
      status: 'error',
      message: 'Bad request. You must provide valid month value',
    })
  }
  let region = req.query.region
  let month = req.query.month
  region = capitalize(region)
  month = Number(month)
  const resData = await TaqvimModel.find(
    { region: region, month: month },
    { _id: 0, __v: 0 }
  )
  res.json(resData)
})

router.get('/weekly', async (req, res) => {
  if (!req.query.region || !req.query.month || !req.query.day) {
    res.status(403)
    return res.send(
      'You must provide valid region and month value on json/www-url-encoded request body or in query'
    )
  }
  let region = req.query.region
  let month = Number(req.query.month)
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
    ).sort('date')
    res.json(data)
  } catch (err) {
    res.status(500)
    res.json(err.message)
  }
})

router.get('/daily', async (req, res) => {
  if (!req.query.region || !req.query.month || !req.query.day) {
    res.status(403)
    return res.send(
      'You must provide valid region and month value on json/www-url-encoded request body or in query'
    )
  }
  let region = req.query.region
  let month = req.query.month
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

router.get('/present/week', async (req, res) => {
  if (!req.query.region) {
    res.status(403)
    return res.send(
      'You must provide valid region and month value on json/www-url-encoded request body or in query'
    )
  }
  let region = capitalize(req.query.region)
  let now = DateTime.now()
  let from_date = now.startOf('week').toISODate()
  let to_date = now.endOf('week').toISODate()
  try {
    let data = await TaqvimModel.find(
      {
        region: region,
        $and: [{ date: { $gte: from_date } }, { date: { $lte: to_date } }],
      },
      { _id: 0, __v: 0, month: 0, day: 0 }
    ).sort('date')
    let resData = data.map(({ weekday, date, times, region, hijri_date }) => {
      return {
        region: region,
        date: date.toLocaleString('uz-UZ'),
        hijri_date: hijri_date,
        weekday: weekday,
        times: times,
      }
    })
    res.json(resData)
  } catch (err) {
    res.status(500)
    res.json(err.message)
  }
})
router.get('/present/day', async (req, res) => {
  if (!req.query.region) {
    res.status(403)
    return res.send(
      'You must provide valid region and month value in query parametres'
    )
  }
  let region = capitalize(req.query.region)
  try {
    let date = DateTime.now().toISODate()
    let dbData = await TaqvimModel.findOne(
      {
        region: region,
        date: date,
      },
      { _id: 0, __v: 0, month: 0, day: 0 }
    )
    let resonse = {
      region: dbData.region,
      date: date.toLocaleString('uz-UZ'),
      weekday: dbData.weekday,
      hijri_date: dbData.hijri_date,
      times: dbData.times,
    }
    res.json(resonse)
  } catch (error) {
    res.status(404)
    res.send('Not found')
  }
})
module.exports = router
