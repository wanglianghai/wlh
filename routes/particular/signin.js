const express = require('express')
const router = express.Router()
const logic = require('./logic')

router.get('/', (req, res) => {
  username = req.session.username
  if (username === undefined) {
    username = ''
  }
  res.render('./particular/signin', {username: username})
})

router.post('/', (req, res, next) => {
  logic.checkUser(req, res, next)
})

module.exports = router