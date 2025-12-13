const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// category list
invCont.buildByCategoryId = async function (req, res, next) {
  const category_id = req.params.categoryId
  let exchange = req.session.currency || "USD"
  const data = await invModel.getCategoryItems(category_id)
  const rows = await utilities.buildCategoryList(data, exchange)
  let nav = await utilities.getNav()
  const className = data[0].category_name
  res.render("./inventory/data", {
    title: className + " Agrochemicals",
    nav,
    rows,
  })
}

// agrochemical list
invCont.buildByElementId = async function (req, res, next) {
  const elementId = req.params.elementId
  let exchange = req.session.currency || "USD"
  const data = await invModel.getAgrochemicalsById(elementId)
  const rows = await utilities.buildAgrochemicalsDetails(data, exchange)
  let nav = await utilities.getNav()
  const carName = data[0].item_name
  res.render("./inventory/data", {
    title: carName,
    nav,
    rows,
  })
}

invCont.changeCurrency = async function (req, res) {
  const { currency } = req.body
  req.session.currency = currency
  req.flash("notice", `Currency changed to ${currency}`)
  res.redirect("/");
}

// errors handeler
invCont.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

  module.exports = invCont