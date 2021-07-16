const express = require("express");
const path = require("path");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const routes = require("./routes/index");
const db = require("./config/db/index");
const session = require('express-session')
const methodOverride = require('method-override')
const app = express();
const port = 3000;

// static file
app.use(express.static(path.join(__dirname, "public")));

// Middle ware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret',
  cart:{cartItems:[],total:0},
  cookie: { maxAge: 3600000 * 1 }, // 1hour
}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//HTTP Logger
app.use(morgan("dev"));

//template engine
app.engine(".hbs", handlebars({ extname: ".hbs" ,helpers: { ///viết hàm tính toán 
  tich : (a,b) => parseFloat(a) * parseFloat(b) ,
  sum : (a,b) => parseFloat(a) + parseFloat(b) ,
}}));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

//gọi hàm routes
routes(app);

//connect to DB
db.connect();

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
