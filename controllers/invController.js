const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// category list
invCont.buildByCategoryId = async function (req, res, next) {
  const category_id = req.params.categoryId
  const data = await invModel.getCategoryItems(category_id)
  const rows = await utilities.buildCategoryList(data)
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
  const data = await invModel.getAgrochemicalsById(elementId)
  const rows = await utilities.buildAgrochemicalsDetails(data)
  let nav = await utilities.getNav()
  const carName = data[0].item_name
  res.render("./inventory/data", {
    title: carName,
    nav,
    rows,
  })
}

// errors handeler
invCont.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

  module.exports = invCont