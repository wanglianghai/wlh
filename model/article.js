const Article = require('../lib/db').Article
module.exports = {
  create: (article) =>
    Article.insert(article).exec(),

  find: (id) =>
    Article.find({_id: id}).addCreatedTime('YYYY-MM-DD HH:mm').exec()
}