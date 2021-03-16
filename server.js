if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')


app.use(expressLayouts)
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')



// MONGO DATABASE CONNECTION

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error('error'))
db.once('open', () => console.log('Connected to mongoose'))

// ROUTES

const indexRouter = require('./routes/index')
const users = require('./routes/users')

app.use('/', indexRouter) 
app.use('/users', users)

// SERVER PORT

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on port ${PORT}`))    