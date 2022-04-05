const express = require('express')
const router = express.Router()
const { DateTime } = require('luxon')
const TaqvimModel = require('../models/taqvim')
router.get('/week', async (req, res) => {
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
router.get('/day', async (req, res) => {
  if (!req.query.region) {
    res.status(403)
    return res.send(
      'You must provide valid region and month value in query parametres'
    )
  }
  let region = req.query.region
  region = capitalize(region)
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
    console.log(error)
  }
})

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

module.exports = router
