const fs = require('fs')
const User = require('../../model/user')
const validation = require('../validation')
const sha1 = require('sha1')
const Article = require('../../model/article')

//注册检测：成功返回true，失败返回false
function checkSignin(req, res, user) {
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

//文章检测：成功返回true，失败返回false
function checkArticle(req, res, article) {
  try {
    validation.article(article)
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('/article/create')
    return false
  }

  return true
}

//注册进数据库：成功返回true，失败返回false
function inSinginDb(req, res, next, user) {
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

      return true
    })
    .catch(e => {
      fs.unlink(req.files.avatar.path)
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名重复')
        return res.redirect('/signup')
      }
      next(e)
    })
  return false
}

//文章进数据库：成功重定向到发布成功界面返回true，失败返回false
function inArticleDb(req, res, next, article) {
  Article.create(article)
    .then((result) => {
      const id = result.ops[0]._id
      req.flash('success', '发布成功')
      res.redirect(`/article/${id}`)
      return true
    })
    .catch((e) => {
      next(e)
    })

  return false
}

//登入验证：成功返回true，失败返回false
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

//登入进数据库：成功返回true，失败返回false
function checkdb(req, res, next, user) {
  User.find(user)
    .then(result => {
      const userdb = result[0]

      if (validate(req, res, user, userdb)) {
        req.session.user = userdb
        res.redirect('/article')
        return true
      }
    })
    .catch(e => {
      next(e)
    })

  return false
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

    if (checkSignin(req, res, user)) {
      if (inSinginDb(req, res, next,user)) {
        return true
      }
    }

    return false
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

  //存入成功返回true，　else false
  articleInDb: (req, res, next) => {
    let article = {
      author: req.session.user._id,
      title: req.fields.title,
      content: req.fields.content
    }

    if (checkArticle(req, res, article)) {
      if (inArticleDb(req, res, next, article)) {
        return true
      }
    }

    return false
  },

  //查找成功返回true，失败重定向到文章页返回false
  articleFind: (req, res, next) => {
    const id = req.params.id
    Article.addBrowse(id)
    Article.find(id)
      .then(result => {
        const article = result[0]
        let error = ''
        if (!article) {
          error = '找不到此文章'
        }
        res.render('./particular/articleSpecial', {article: article, error: error})
      })
      .catch(e => {
        next(e)
      })
  },

  //文章页展示
  article: (req, res, next) => {
    const id = req.query.author

    Article.findArticle(id)
      .then(result => {
        res.render('./particular/article', {articles: result})
      })
      .catch(e => {
        next(e)
      })
  },

  //文章删除
  articleDelete: (req, res, next) => {
    const id = req.params.id
    const user = req.session.user._id

    Article.find(id)
      .then(result => {
        const article = result[0]
        if (!article) {
          throw Error('文章不存在')
        }

        if (user !== article.author.toString()) {
          throw Error('权限不足')
        }
        Article.delete(id)
          .then(() => {
            req.flash('success', '删除文章成功')
            res.redirect('/article')
          })
          .catch(e => {
            next(e)
          })

      })
  },

  //文章编辑
  articleEdited: (req, res, next) => {

  }
}