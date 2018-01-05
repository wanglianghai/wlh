const express = require('express')
const router = express.Router()
//检测用户的中间件模块
const checkUser = require('../../middleware/check').userout
const logic = require('./logic')

//创建一篇文章页 GET /article/create
router.get('/', checkUser, (req, res) => {
  res.render('./particular/articleCreate')
})

//创建一篇文章 POST /article/create
router.post('/', checkUser, (req, res, next) => {
  logic.articleInDb(req, res, next)
})

module.exports = router