const fs = require('fs')
const express = require('express')
const router = express.Router()
const User = require('../../model/manipulating')
const validation = require('../validation')

router.get('/', (req, res) => {
  res.render('./particular/signup')
})

router.post('/', (req, res, next) => {
  const user = {
    name: req.fields.name,
    password: req.fields.password,
    repassword: req.fields.repassword,
    gender: req.fields.gender,
    avatar: req.files.avatar.path.split('/').pop(),
    sign: req.fields.sign
  }
  try {
    validation.validation(user)
  } catch(e) {
    fs.unlink(req.files.avatar.path)
    console.log(e.message)
    return res.redirect('/signup')
  }

  delete user.repassword
  User.create(user).catch(e => {
    fs.unlink(req.files.avatar.path)
    if (e.message.match('duplicate key')) {
      console.log('用户名重复')
      return res.redirect('/signup')
    }
    next(e)
  })
  res.redirect('/signup')
})
module.exports = router