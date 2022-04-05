const express = require('express')
const router = express.Router()
const api = require('./api')
const present = require('./present')
router.use('/api', api)
router.use('/present', present)

module.exports = router
