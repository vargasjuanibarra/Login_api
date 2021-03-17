if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

//PASSPORT CONFIG 
require('./config/passport')(passport)

// EJS
app.use(expressLayouts)
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')



// MONGO DATABASE CONNECTION

const mongoose = require('mongoose')
const db = mongoose.connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
db.on('error', error => console.error('error'))
db.once('open', () => console.log('Connected to mongoose'))

// BODYPARSER
app.use(express.urlencoded({ extended: false}))

// EXPRESS SESSION
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

  // PASSPORT MIDDLEWARE
  app.use(passport.initialize());
  app.use(passport.session());

  // CONNECT FLASH
  app.use(flash())

  // GLOBAL VARS FOR SUCCES OR ERROR MESSAGES
  app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();

  })


// ROUTES

const indexRouter = require('./routes/index')
const users = require('./routes/users')

app.use('/', indexRouter) 
app.use('/users', users)




// SERVER PORT

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on port ${PORT}`))    