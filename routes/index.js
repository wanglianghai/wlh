module.exports = (app) => {
  app.get('/', (req, res) => {
    res.redirect('/article')
  })
  app.use('/article', require('./particular/article'))
  app.use('/signup', require('./particular/signup'))
}