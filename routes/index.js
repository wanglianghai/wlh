module.exports = (app) => {
  app.use((req, res, next) => {
    res.locals.user = req.session.user
    res.locals.error = req.flash('error').toString()
    res.locals.success = req.flash('success').toString()
    next()
  })
  app.get('/', (req, res) => {
    res.redirect('/article')
  })
  app.use('/signin', require('./particular/signin'))
  app.use('/signout', require('./particular/signout'))
  app.use('/signup', require('./particular/signup'))
  app.use('/article', require('./particular/article'))
}