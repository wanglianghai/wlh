module.exports = {
  //用户登入放回文章页
  userin: (req, res, next) => {
    if (req.session.user) {
      req.flash('error', '您已经登入了')
      return res.redirect('/article')
    }
    next()
  },

  //用户未登入返回上一次
  userout: (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', '您未登入')
      return res.redirect('/signin')
    }
    next()
  }
}