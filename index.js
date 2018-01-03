const express = require('express')
const app = express() //模块中的一个函数
const indexRouter = require('./routes/index')
const path = require('path')
const config = require('config-lite')(__dirname)
const pkg = require('./package')
const formidable = require('express-formidable')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

// 设置视图目录
app.set('views', path.join(__dirname, 'views'))
// 设置视图引擎为 ejs
app.set('view engine', 'pug')

// 设置服务器静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

// 处理表单及文件上传的中间件
app.use(formidable({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true
}))

app.use(session({
  secret: config.session.secret,  //必须的session密码
  resave: false,  //重新写session
  saveUninitialized: false,  //保存未被初始化的
  cookie: {
    maxAge: config.session.maxAge //cookie 过期时间
  },
  store: new MongoStore({
    url: config.mongodb  //数据库的连接地址
  })
}))

//消息
app.use(flash())

indexRouter(app)

app.listen(config.port, () => {
  console.log(`${pkg.name} listen on ${config.port}`)
})