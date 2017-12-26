const express = require('express')
const app = express() //模块中的一个函数
const indexRouter = require('./routes/index')
const path = require('path')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

indexRouter(app)
app.listen(3000)