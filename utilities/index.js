const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

let exchangeRates = { USD: 1 }; // fallback

// Load exchange rates from API
async function loadExchangeRates() {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD');
    if (!response.ok) throw new Error("Failed to fetch exchange rates");
    const data = await response.json();
    exchangeRates = { ...exchangeRates, ...data.rates };
    console.log("Exchange rates ready");
  } catch (error) {
    console.error("Exchange API failed, using fallback USD only", error);
    exchangeRates = { USD: 1 };
  }
}
Util.loadExchangeRates = loadExchangeRates;

// Build nav menu
Util.getNav = async function() {
  let data = await invModel.getCategory();
  let nav = "<ul>";
  nav += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach(row => {
    nav += `<li><a href="/inv/category/${row.category_id}" title="See our inventory of ${row.category_name} supplies">${row.category_name}</a></li>`;
  });
  nav += "</ul>";
  return nav;
};

// Build category list
Util.buildCategoryList = async function(data, exchange) {
  let rows = "";
  if (data.length > 0) {
    rows += '<ul id="inv-display">';
    data.forEach(agrochemical => {
      rows += '<li>';
      rows += `<a href="../../inv/data/${agrochemical.item_id}" title="View ${agrochemical.item_name} details"><img src="/images${agrochemical.item_image}" alt="Image of ${agrochemical.item_name}" /></a>`;
      rows += '<div class="data">';
      rows += `<h2><a href="../../inv/data/${agrochemical.item_id}">${agrochemical.item_name}</a></h2>`;
      let price = parseFloat(agrochemical.item_price);
      let priceFinal = exchangeRates[exchange] ? price * exchangeRates[exchange] : price;
      rows += `<span>$${new Intl.NumberFormat('en-US').format(priceFinal)}</span>`;
      rows += '</div>';
      rows += '<form id="updateForm" class="addInformation" action="/cart/add" method="post">';
      rows += `<input type="hidden" name="item_id" value="${agrochemical.item_id}">`;
      rows += '<button type="submit">Add to the cart</button>';
      rows += '</form>';
      rows += '</li>';
    });
    rows += '</ul>';
  } else {
    rows += '<p class="notice">Sorry, no matching items could be found.</p>';
  }
  return rows;
};

// Build single item details
Util.buildAgrochemicalsDetails = async function(data, exchange) {
  let rows = "";
  if (data.length > 0) {
    const item = data[0];
    rows += '<div id="agrochemicals-details">';
    rows += `<img src="/images${item.item_image}" alt="Image of ${item.item_name}" />`;
    rows += '<div class="agrochemicalsData">';
    rows += `<p>Manufacturer: ${item.item_producer}</p>`;
    rows += `<p>Description: ${item.item_description}</p>`;
    rows += `<p>Details: ${item.item_details}</p>`;
    rows += `<p>Amount: ${item.item_amount}</p>`;
    const price = parseFloat(item.item_price);
    const priceFinal = exchangeRates[exchange] ? price * exchangeRates[exchange] : price;
    rows += `<p>Price: $${new Intl.NumberFormat('en-US').format(priceFinal)}</p>`;
    rows += '</div>';
    rows += '<form id="updateForm" class="addInformation" action="/cart/add" method="post">';
    rows += `<input type="hidden" name="item_id" value="${item.item_id}">`;
    rows += '<button type="submit">Add to the cart</button>';
    rows += '</form>';
    rows += '</div>';
  } else {
    rows += '<p class="notice">Sorry, no matching item could be found.</p>';
  }
  return rows;
};

// JWT token check
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.loggedin = 0;
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      res.clearCookie("jwt");
      res.locals.loggedin = 0;
      return next();
    }
    res.locals.accountData = accountData;
    res.locals.loggedin = 1;
    next();
  });
};

// Logged-in check for protected pages
Util.checkLoginAccount = (req, res, next) => {
  if (res.locals.loggedin) return next();
  req.flash("notice", "Please log in.");
  return res.redirect("/account/login");
};

// Build header (with currency select and account links)
Util.addHeader = async (req, res, next) => {
  res.locals.header = '';
  res.locals.header += '<form class="addInformation" action="/inv/currency" method="post">';
  res.locals.header += '<select name="currency" id="currencyList" required>';
  res.locals.header += "<option value=''>Choose a Currency</option>";
  res.locals.header += "<option value='USD'>USD</option>";
  for (const code of Object.keys(exchangeRates)) {
    res.locals.header += `<option value="${code}">${code}</option>`;
  }
  res.locals.header += '</select>';
  res.locals.header += '<button type="submit">Set Currency</button>';
  res.locals.header += '</form>';

  if (res.locals.loggedin) {
    const name = `${res.locals.accountData.enter_firstname} ${res.locals.accountData.enter_lastname}`;
    res.locals.header += '<a href="/cart/">Check Your Cart</a>';
    res.locals.header += `<a href="/account/">Welcome ${name}</a>`;
    res.locals.header += '<a href="/account/logout">Logout</a>';
  } else {
    res.locals.header += '<a href="/account/login">My Account</a>';
  }

  next();
};

// Build cart display
Util.getCart = async function(data, exchange) {
  let rows = "";
  if (data.length > 0) {
    rows += '<ul id="cart-display">';
    data.forEach(item => {
      rows += '<li>';
      rows += `<a href="../../inv/data/${item.item_id}" title="View ${item.item_name} details"><img src="/images${item.item_image}" alt="Image of ${item.item_name}" /></a>`;
      rows += `<h2><a href="../../inv/data/${item.item_id}">${item.item_name}</a></h2>`;
      rows += '<div class="buttons">';
      rows += `<form action="/cart/add" method="post"><input type="hidden" name="item_id" value="${item.item_id}"><button type="submit">Add More</button></form>`;
      rows += `<form action="/cart/eliminate" method="post"><input type="hidden" name="item_id" value="${item.item_id}"><button type="submit">Rest Item</button></form>`;
      rows += '</div>';
      const quantity = parseFloat(item.cart_a_quantity);
      const price = parseFloat(item.item_price);
      const priceFinal = exchangeRates[exchange] ? quantity * price * exchangeRates[exchange] : quantity * price;
      rows += `<div class="values"><span>Price: $${new Intl.NumberFormat('en-US').format(priceFinal)}</span><p>Quantity: ${item.cart_a_quantity}</p></div>`;
      rows += '</li>';
    });
    rows += '</ul>';
  } else {
    rows = '<p class="notice">Sorry, no cart was created.</p>';
  }
  return rows;
};

// Build total
Util.getTotal = async function(data, exchange) {
  if (!data.length) return '<p class="notice">Sorry, your cart is empty.</p>';

  let total = 0;
  data.forEach(item => {
    total += parseFloat(item.item_price) * parseFloat(item.cart_a_quantity);
  });
  let taxes = total * 0.0825;
  let shipping = 40;
  let totalCost = total + taxes + shipping;

  if (exchangeRates[exchange]) {
    total = total * exchangeRates[exchange];
    taxes = taxes * exchangeRates[exchange];
    shipping = shipping * exchangeRates[exchange];
    totalCost = totalCost * exchangeRates[exchange];
  }

  let rows = '';
  rows += `<span>Total: $${new Intl.NumberFormat('en-US').format(total)}</span>`;
  rows += `<span>Taxes: $${new Intl.NumberFormat('en-US').format(taxes)}</span>`;
  rows += `<span>Shipping: $${new Intl.NumberFormat('en-US').format(shipping)}</span>`;
  rows += `<span>Final Cost: $${new Intl.NumberFormat('en-US').format(totalCost)}</span>`;
  return rows;
};

// Error handler wrapper
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;