const fs = require('fs')
const User = require('../../model/manipulating')
const validation = require('../validation')

function check(req, res, user) {
  try {
    validation.validation(user)
  } catch(e) {
    fs.unlink(req.files.avatar.path)
    req.flash('error', e.message)
    return res.redirect('/signup')
  }
}

function indb(req, res, next,user) {
  delete user.repassword
  User.create(user)
    .then((result) => {
      user = result.ops[0]
      // 删除密码这种敏感信息，将用户信息存入 session
      delete user.password
      // 此 user 是插入 mongodb 后的值，包含 _id
      req.session.user = user
      // 消息写入 flash
      req.flash('success', '登入成功')
      // 跳转到首页
      res.redirect('/article')
    })
    .catch(e => {
      fs.unlink(req.files.avatar.path)
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名重复')
        return res.redirect('/signup')
      }
      next(e)
    })
}

module.exports = {
  userindb: (req, res, next) => {
    let user = {
      name: req.fields.name,
      password: req.fields.password,
      repassword: req.fields.repassword,
      gender: req.fields.gender,
      avatar: req.files.avatar.path.split('/').pop(),
      sign: req.fields.sign
    }

    check(req, res, user)

    indb(req, res, next,user)
  }
}