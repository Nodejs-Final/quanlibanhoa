const express = require('express')
const path = require('path')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const routes = require('./routes/index')
const app = express()
const port = 3000

// static file 
app.use(express.static(path.join(__dirname, 'public')))

// Middle ware
app.use(express.urlencoded({
  extended : true
}))
app.use(express.json())

//HTTP Logger
app.use(morgan('dev'))

//template engine
app.engine('.hbs',handlebars({extname : '.hbs'}))
app.set('view engine','.hbs')
app.set('views',path.join(__dirname, 'views'))

//gọi hàm routes
routes(app);


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})