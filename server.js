// Statements
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const homeController = require("./controllers/homeController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
const accountRoute = require("./routes/accountRoute")
const cartRoute = require("./routes/cartRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser") 


utilities.loadExchangeRates()
  .then(() => console.log("Exchange rates loaded"))
  .catch(err => console.error("Failed to load exchange rates", err));

// Midelware
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(cookieParser())

app.use(utilities.checkJWTToken)

app.use(utilities.addHeader)

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Templates
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// Stated Routes
app.use(static)
// Home
app.get("/", utilities.handleErrors(homeController.buildHome))
// Inventory
app.use("/inv", utilities.handleErrors(inventoryRoute))
// Account
app.use("/account", utilities.handleErrors(accountRoute))
// Cart
app.use("/cart", utilities.handleErrors(cartRoute))
// Not Found
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we dont find that page.'})
})

// Error
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'There was a error. sorry'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

// Local Server Information
const port = process.env.PORT
const host = process.env.HOST

// Server Works Rigt
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
