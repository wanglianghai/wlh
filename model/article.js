const Article = require('../lib/db').Article
const objectidToTimestamp = require('objectid-to-timestamp')
const moment = require('moment')

Article.plugin('addCreatedTime', {
  afterFindOne: function (result, format) {
    if (!result)
      return result
    result.createdTime = moment(objectidToTimestamp(result._id)).format(format)
    return result
  },

  afterFind: function (results, format) {
    if (!results.length)
      return results
    return results.map(result => {
      result.createdTime = moment(objectidToTimestamp(result._id)).format(format)
      return result
    })
  }
})

Article.plugin('addColumnBrowse', {
  beforeInsert: function () {
    this._args[0].browse = 0
  }
})

module.exports = {
  create: (article) =>
    Article.insert(article).addColumnBrowse().exec(),

  find: (id) =>
    Article.find({_id: id}).populate({path: 'author', model: 'User'}).addCreatedTime('YYYY-MM-DD HH:mm').exec(),

  findArticle: (id) => {
    const query = {}
    if (id) {
      query.author = id
    }
    return Article.find(query).populate({path: 'author', model: 'User'}).addCreatedTime('YYYY-MM-DD HH:mm').sort({_id: -1}).exec()
  },

  addBrowse: (id) => {
    Article.updateOne({_id: id}, {$inc:{browse: 1}}).exec()
  },

  delete: (id) =>
    Article.remove({_id: id}).exec()

}