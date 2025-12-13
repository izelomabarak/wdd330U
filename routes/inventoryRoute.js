// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory and agrochemical view
router.get("/category/:categoryId", utilities.handleErrors(invController.buildByCategoryId));

router.get("/data/:elementId", utilities.handleErrors(invController.buildByElementId));

//update currency
router.post(
  "/currency", utilities.handleErrors(invController.changeCurrency)
)

// error handeler
router.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = router;