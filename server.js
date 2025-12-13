// Required modules
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const path = require("path");
const pool = require("./database/");
const env = require("dotenv").config();

// Controllers & Routes
const utilities = require("./utilities");
const staticRoutes = require("./routes/static");
const homeController = require("./controllers/homeController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const cartRoute = require("./routes/cartRoute");

// App init
const app = express();
app.set("trust proxy", 1);

// Cache control for Render
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

// Load exchange rates
utilities.loadExchangeRates()
  .then(() => console.log("Exchange rates loaded"))
  .catch(err => console.error("Failed to load exchange rates", err));

// Middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  }
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT token check
app.use(utilities.checkJWTToken);

// Header & navigation
app.use(utilities.addHeader);

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Serve static assets
app.use(express.static(path.join(__dirname, "public")));

// Template engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Routes
app.use(staticRoutes);

// Home
app.get("/", utilities.handleErrors(homeController.buildHome));

// Inventory
app.use("/inv", utilities.handleErrors(inventoryRoute));

// Account
app.use("/account", utilities.handleErrors(accountRoute));

// Cart
app.use("/cart", utilities.handleErrors(cartRoute));

// 404 Not Found
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we don’t find that page." });
});

// Error handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at "${req.originalUrl}": ${err.message}`);
  let message = err.status === 404 ? err.message : "There was an error. Sorry.";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav
  });
});

// Server
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});