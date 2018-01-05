const Article = require('../lib/db').Article
module.exports = {
  create: (article) =>
    Article.insert(article).exec()

}