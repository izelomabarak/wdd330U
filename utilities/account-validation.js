const accountModel = require("../models/account-model")
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

//login registation
  validate.registationRules = () => {
    return [
      body("enter_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),
  
      body("enter_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a last name."), 
  
      body("enter_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (enter_email) => {
          const emailExists = await accountModel.checkExistingAccount(enter_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
        }),
  
      body("enter_password")
        .trim()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage("Password does not meet requirements."),
    ]
  }
  
//return errors or continue
  validate.checkRegData = async (req, res, next) => {
    const { enter_firstname, enter_lastname, enter_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/registration", {
        errors,
        title: "Registration",
        nav,
        enter_firstname,
        enter_lastname,
        enter_email,
      })
      return
    }
    next()
  }

//login rules
  validate.loginRules = () => {
    return [
      body("enter_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("This Email does not have a acount, you mus log in.")
        .custom(async (enter_email) => {
          const emailExists = await accountModel.checkExistingAccount(enter_email)
          if (emailExists === 0){
            throw new Error("This Email does not have a acount, you mus log in.")
          }
        }),
  
      body("enter_password")
        .trim()
        .notEmpty()
        .withMessage("Incorrect Password, Tried Again"),
        
    ]
  }
  
  //return errors
  validate.checkLogData = async (req, res, next) => {
    const { enter_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "login",
        nav,
        enter_email,
      })
      return
    }
    next()
  }

module.exports = validate