const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

// create nav
Util.getNav = async function () {
  let data = await invModel.getCategory()
  console.log(data)
  let nav = "<ul>"
  nav += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    nav += "<li>"
    nav += '<a href="/inv/category/' + row.category_id + '" title="See our inventory of ' + row.category_name + ' suplies">' + row.category_name + "</a>"
    nav += "</li>"
  })
  nav += "</ul>"
  return nav
}

// list of items
Util.buildCategoryList = async function(data){
  let rows
  if(data.length > 0){
    rows = '<ul id="inv-display">'
    data.forEach(agrochemical => { 
      rows += '<li>'
      rows +=  '<a href="../../inv/data/'+ agrochemical.item_id 
      + '" title="View ' + agrochemical.item_name + 'details"><img src="/images' + agrochemical.item_image 
      +'" alt="Image of '+ agrochemical.item_name +' on his presentation" /></a>'
      rows += '<div class="data">'
      rows += '<h2>'
      rows += '<a href="../../inv/data/' + agrochemical.item_id +'" title="View ' 
      + agrochemical.item_name + ' details">' 
      + agrochemical.item_name + '</a>'
      rows += '</h2>'
      rows += '<span>$' 
      + new Intl.NumberFormat('en-US').format(agrochemical.item_price) + '</span>'
      rows += '</div>'
      rows += '<form id="updateForm" class="addInformation" action="/cart/add" method="post">'
      rows += '<input type="hidden" name="item_id" value="' + agrochemical.item_id + '">'
      rows += '<button type="submit">Add to the car</button>'
      rows += '</form>'
      rows += '</li>'
    })
    rows += '</ul>'
  } else { 
    rows += '<p class="notice">Sorry, no matching agrochemials could be found.</p>'
  }
  return rows
}

// Agrochemicals view
Util.buildAgrochemicalsDetails = async function(data){
  let rows
  if(data.length > 0){
    rows = '<div id="agrochemicals-details">'
    rows +=  '<img src="/images' + data[0].item_image +'" alt="Image of '+ data[0].item_name +' on his presentation" />'
    rows += '<div class="agrochemicalsData">'
    rows += '<p>Manufacturer: ' + data[0].item_producer + '</p>'
    rows += '<p>Description: ' + data[0].item_description + '</p>'
    rows += '<p>Details: ' + data[0].item_details + '</p>'
    rows += '<p>Amount: ' + data[0].item_amount + '</p>'
    rows += '<p>Price: ' + data[0].item_price + '</p>'
    rows += '</div>'
    rows += '<form id="updateForm" class="addInformation" action="/cart/add" method="post">'
    rows += '<input type="hidden" name="item_id" value="' + agrochemical.item_id + '">'
    rows += '<button type="submit">Add to the car</button>'
    rows += '</form>'
    rows += '</div>'
  } else { 
    rows += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return rows
}

//check token
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

// check log in
 Util.checkLoginAccount = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

// create header
Util.addHeader = async (req, res, next) => {
  res.locals.header = '';
  if(res.locals.loggedin){
    const name = res.locals.accountData.enter_firstname + " " + res.locals.accountData.enter_lastname
    res.locals.header += '<a class="buyCart" href="/cart/">Check Your Cart</a>'
    res.locals.header += '<a title="Click to view account" href="/account/">Welcome ' + name + '</a>';
    res.locals.header += '<a title="Click to logout" href="/account/logout">Logout</a>';
  } else {
    res.locals.header += '<a title="Click to log in" href="/account/login">My Account</a>';
  }
  next();
}

// list of items
Util.getCart = async function(data){
  let rows
  if(data.length > 0){
    rows = '<ul id="cart-display">'
    data.forEach(agrochemical => { 
      rows += '<li>'
      rows +=  '<a href="../../inv/data/'+ agrochemical.item_id 
      + '" title="View ' + agrochemical.item_name + 'details"><img src="/images' + agrochemical.item_image 
      +'" alt="Image of '+ agrochemical.item_name +' on his presentation" /></a>'
      rows += '<h2>'
      rows += '<a href="../../inv/data/' + agrochemical.item_id +'" title="View ' 
      + agrochemical.item_name + ' details">' 
      + agrochemical.item_name + '</a>'
      rows += '</h2>'
      rows += '<div class="buttons">'
      rows += '<form id="updateForm" class="addInformation" action="/cart/add" method="post">'
      rows += '<input type="hidden" name="item_id" value="' + agrochemical.item_id + '">'
      rows += '<button type="submit" >Add More</button>'
      rows += '</form>'
      rows += '<form id="updateForm" class="addInformation" action="/cart/eliminate" method="post">'
      rows += '<input type="hidden" name="item_id" value="' + agrochemical.item_id + '">'
      rows += '<button type="submit" >Rest Item</button>'
      rows += '</form>'
      rows += '</div>'
      const numberItems = parseFloat(agrochemical.cart_a_quantity)
      const priceP = parseFloat(agrochemical.item_price)
      const priceFinal = numberItems * priceP
      rows += '<div class="values">'
      rows += '<span>$' 
      + new Intl.NumberFormat('en-US').format(priceFinal) + '</span>'
      rows += '<p>' + agrochemical.cart_a_quantity + '</p>'
      rows += '</div>'
      rows += '</li>'
    })
    rows += '</ul>'
  } else { 
    rows = '<p class="notice">Sorry, no cart was created.</p>'
  }
  return rows
}

// list of items
Util.getTotal = async function(data){
  let rows
  let total = 0;
  if(data.length > 0){
    data.forEach(agrochemical => { 
      let cost = parseFloat(agrochemical.item_price);
      cost = cost * parseFloat(agrochemical.cart_a_quantity)
      total = total + cost;
    })
    let taxes = total * .0825
    const shipping = 40
    let totalCost = total + taxes + shipping
    rows = '<span>Total: $' + new Intl.NumberFormat('en-US').format(total) + '</span>'
    rows += '<span>Taxes: $' + new Intl.NumberFormat('en-US').format(taxes) + '</span>'
    rows += '<span>Shipping: $' + new Intl.NumberFormat('en-US').format(shipping) + '</span>'
    rows += '<span>Final Cost: $' + new Intl.NumberFormat('en-US').format(totalCost) + '</span>'
  } else { 
    rows = '<p class="notice">Sorry, your cart is empty.</p>'
  }
  return rows
}

// errors handeler
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util