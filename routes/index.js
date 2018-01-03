module.exports = (app) => {
  app.use((req, res, next) => {
    res.locals.user = req.session.user
    res.locals.error = req.flash('error').toString()
    next()
  })
  app.get('/', (req, res) => {
    res.redirect('/article')
  })
  app.use('/article', require('./particular/article'))
  app.use('/signup', require('./particular/signup'))
}