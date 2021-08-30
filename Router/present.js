const express = require("express")
const router = express.Router()
const { DateTime } = require("luxon")
const TaqvimModel = require("../models/taqvim")
router.get("/week", async (req, res) => {
  if (!req.body.region && !req.query.region) {
    res.status(403)
    return res.send(
      "You must provide valid region and month value on json/www-url-encoded request body or in query"
    )
  }
  let region = req.body.region ?? req.query.region
  let now = DateTime.now()
  let month = now.toObject().month
  let from_date = now.startOf("week").toISODate()
  let to_date = now.endOf("week").toISODate()
  console.log(from_date)
  try {
    let data = await TaqvimModel.find(
      {
        region: region,
        $and: [{ date: { $gte: from_date } }, { date: { $lte: to_date } }],
      },
      { _id: 0, __v: 0, month: 0, day: 0 }
    )
    console.log(data)
    let resData = data.map(({ weekday, date, times, region, hijri_date }) => {
      return {
        region,
        date: date.toLocaleString("uz-UZ"),
        hijri_date,
        weekday,
        times,
      }
    })
    res.json(resData)
  } catch (err) {
    res.status(500)
    res.json(err.message)
  }
})
router.get("day", async (req, res) => {
  if (!req.body.region && !req.query.region) {
    res.status(403)
    return res.send(
      "You must provide valid region and month value on json/www-url-encoded request body or in query"
    )
  }
  let region = req.body.region ?? req.query.region
  let date = DateTime.now().toISODate()
  try {
    let data = await TaqvimModel.find(
      {
        region: region,
        date: date,
      },
      { _id: 0, __v: 0, month: 0, day: 0 }
    )
    res.json(data)
  } catch (error) {}
})

module.exports = router
