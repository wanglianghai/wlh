module.exports = {
  validation: (user) => {
    check(user.name.length === 0, '用户名不为空')
    check(user.name.length < 2 || user.name.length > 9, '请输入2-9个字的用户名')
    check(user.password.length < 6 || user.password.length > 12, '请输入6-12位密码')
    check(user.password !== user.repassword, '两次密码不一致:')
    check(['m', 'f'].indexOf(user.gender) === -1, '性别只能是男或女')
    check(user.avatar === undefined, '请选择头像')
    check(user.sign.length === 0 || user.sign === undefined, '个人签名不能为空')
    check(user.sign.length > 300, '个人签名最多300字')
  },

  article: (article) => {
    check(article.title.length > 8 || article.title.length <2, '文章标题在2-8个字间')
    check(article.content.length === 0, '文章内容不能为空')
    check(article.content.length > 800, '文章内容不大于800字')
  }
}

function check(condition, string) {
  if (condition) {
    throw new Error(string)
  }
}