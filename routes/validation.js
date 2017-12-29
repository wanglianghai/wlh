module.exports = {
  validation: (user) => {
    if (user.name.length === 0) {
      throw new Error('用户名不为空')
    }
    if (user.name.length < 2 || user.name.length > 9) {
      throw new Error('请输入2-9个字的用户名')
    }
    if (user.password.length < 6 || user.password.length > 12) {
      throw new Error('请输入6-12位密码')
    }
    if (user.password !== user.repassword) {
      throw new Error('两次密码不一致:' + user.password + " :" + user.repassword)
    }
    if (['m', 'f'].indexOf(user.gender) === -1) {
      throw new Error('性别只能是男或女')
    }
    if (user.avatar === undefined) {
      throw new Error('请选择头像')
    }
    if (user.sign.length === 0 || user.sign === undefined) {
      throw new Error('个人签名不能为空')
    }
    if (user.sign.length > 300) {
      throw new Error('个人签名最多300字')
    }
  }
}