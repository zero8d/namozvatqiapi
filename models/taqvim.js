const mongoose = require("mongoose")

const { Schema } = mongoose
const timeSchema = new Schema(
  {
    tong_saharlik: String,
    quyosh: String,
    peshin: String,
    asr: String,
    shom_iftor: String,
    hufton: String,
  },
  { _id: false }
)

const hijri = new Schema(
  {
    month: String,
    day: Number,
  },
  { _id: false }
)

const taqvim = new Schema({
  region: String,
  date: Date,
  month: Number,
  day: Number,
  weekday: String,
  hijri_date: String,
  times: timeSchema,
})

const TaqvimModel = mongoose.model("Taqvim", taqvim)

module.exports = TaqvimModel
