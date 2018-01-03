module.exports = {
  userin: (req, res, next) => {
    if (req.session.user) {
      req.flash('error', '您已经登入了')
      return res.redirect('/article')
    }
    next()
  },

  userout: (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', '您未登入')
      return res.redirect('/signin')
    }
    next()
  }
}