const { DateTime } = require("luxon")

console.log(DateTime.now().startOf("week").toObject())
