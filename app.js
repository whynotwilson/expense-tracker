const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const passport = require('passport')
const port = 3000

app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use('/', express.static('public'))

// 註冊樣板 ifEquals 方法
app.engine('handlebars', exphbs({
  helpers: {
    ifEquals: function (arg1, arg2, options) {
      if (arg1 === arg2) return options.fn(this)
    }
  }
}))

app.use(session({
  secret: 'ALPHA camp expense-tracker',
  resave: false,
  saveUninitialized: true
}))

if (process.env.NODE_ENV !== 'production') { // 如果不是 production 模式
  require('dotenv').config() // 使用 dotenv 讀取 .env 檔案
}

// 資料庫連線
mongoose.connect('mongodb://localhost/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

// 資料庫連線後，透過 mongoose.connection，取得 connection 物件
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongoDB error')
})

// 連線成功
db.once('open', () => {
  console.log('mongoDB connected!')
})

// 設定 passport
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// 在 res.locals 裡的資料，所有的 view 都可以存取
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()

  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// 設定路由器
app.use('/', require('./routes/home'))
app.use('/records', require('./routes/records'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))

app.listen(port, () => {
  console.log('app is running......')
})
