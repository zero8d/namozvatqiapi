const express = require('express')
const router = express.Router()
const TaqvimModel = require('../models/taqvim')

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

module.exports = router
