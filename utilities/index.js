const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
const { check } = require("express-validator")
require("dotenv").config()

// create nav
Util.getNav = async function (req, res, next) {
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
    rows += '</div>'
  } else { 
    rows += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return rows
}
  
// check login
 Util.checkLoginAccount = (req, res, next) => {
  
 }

// errors handeler
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util