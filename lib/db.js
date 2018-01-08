const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass(config.mongodb)

exports.User = mongolass.model('User', {
  name: {type: 'string'},
  password: {type: 'string'},
  avatar: {type: 'string'},
  gender: {type: 'string', enum: ['m', 'f']},
  sign: {type: 'string'},
  createdAt: {type: 'string'}
})
exports.User.index({ name: 1 }, { unique: true }).exec()// 根据用户名找到用户，用户名全局唯一

exports.Article = mongolass.model('Article', {
  author: {type: Mongolass.Types.ObjectId},
  title: {type: 'string'},
  content: {type: 'string'},
  browse: {type: 'number'}
})