const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('./particular/signup')
})

module.exports = router