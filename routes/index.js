module.exports = (app) => {
  app.use('/signup', require('./particular/signup'))
}