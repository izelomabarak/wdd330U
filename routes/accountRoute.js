// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//login succcesful view
router.get("/", utilities.checkLoginAccount, utilities.handleErrors(accountController.buildAccount));

//login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegister));

//logout action
router.get("/logout", utilities.handleErrors(accountController.logout));

//create acount
router.post(
  "/registration",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

//login atemp
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

//error handeler
router.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = router;