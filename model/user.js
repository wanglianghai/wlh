const User = require('../lib/db').User

module.exports = {
  create: (user) =>
    User.insertOne(user).exec(),

  find: (user) =>
    User.find({name: user.name}).exec(),
}

