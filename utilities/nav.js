const invModel = require("../models/inventory-model")

const Nav = {}

// create nav
Nav.getNav = async function () {
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

module.exports = Nav