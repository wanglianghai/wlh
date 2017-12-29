const User = require('./db').User

module.exports = {
  create: (user) =>
    User.insertOne(user).exec()
}