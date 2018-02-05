const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
// const util = require('util')

const index = require('./routes/index')
const users = require('./routes/users')
// const settings = require('./settings')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(session({
//   secret: settings.cookieSecret,
//   store: new MongoStore({
//     db: settings.db,
//   }),
// }))
app.use(express.static(path.join(__dirname, 'public')))// 静态文件路径


// 分配路由
app.get('/', index)
app.get('/u/:user', users)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
