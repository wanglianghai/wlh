const fs = require('fs')
const User = require('../../model/user')
const validation = require('../validation')
const sha1 = require('sha1')
const Article = require('../../model/article')

//注册检测
function check(req, res, user) {
  try {
    validation.validation(user)
  } catch(e) {
    fs.unlink(req.files.avatar.path)
    req.flash('error', e.message)
    res.redirect('/signup')
    return false
  }
  return true
}

//注册进数据库
function indb(req, res, next,user) {
  user.password = sha1(user.password)

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

//登入验证
function validate(req, res, user, userdb) {
  if (userdb === undefined) {
    req.flash('error', '用户名不存在')
    res.redirect('/signin')
    return false
  }
  if (sha1(user.password) !== userdb.password) {
    req.flash('error', '密码错误')
    res.redirect('/signin')
    return false
  }

  return true
}

//登入进数据库
function checkdb(req, res, next, user) {
  User.find(user)
    .then(result => {
      const userdb = result[0]

      if (validate(req, res, user, userdb)) {
        req.session.user = userdb
        res.redirect('/article')
      }
    })
    .catch(e => {
      next(e)
    })
}
module.exports = {
  userInDb: (req, res, next) => {
    let user = {
      name: req.fields.name,
      password: req.fields.password,
      repassword: req.fields.repassword,
      gender: req.fields.gender,
      avatar: req.files.avatar.path.split('/').pop(),
      sign: req.fields.sign
    }

    if (check(req, res, user)) {
      indb(req, res, next,user)
    }
  },

  //使用了，因为那是黑的，好像就显示不出来
  checkUser: (req, res, next) => {
    let user = {
      name: req.fields.name,
      password: req.fields.password
    }

    req.session.username = user.name

    checkdb(req, res, next, user)
  },

  articleInDb: (req, res, next) => {
    let article = {
      author: req.session.user._id,
      title: req.fields.title,
      content: req.fields.content
    }

    try {
      validation.article(article)
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/article/create')
    }

    Article.create(article)
      .then((result) => {
        req.flash('success', '发布成功')
        res.redirect(`/article/`)
      })
      .catch((e) => {
        next(e)
      })
  }
}