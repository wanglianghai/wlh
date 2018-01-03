const express = require('express')
const router = express.Router()
const logic = require('./logic')

const checkUser = require('../../middleware/check').userin

router.get('/', checkUser, (req, res) => {
  res.render('./particular/signup')
})

router.post('/', checkUser, (req, res, next) => {
  logic.userindb(req, res, next)
})
module.exports = router