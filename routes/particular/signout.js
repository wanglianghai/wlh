const express = require('express')
const router = express.Router()
const userout = require('../../middleware/check').userout

router.get('/', userout, (req, res) => {
  req.session.user = null
  req.flash('success', '登出成功')
  res.redirect('/article')
})

module.exports = router