const utilitiesnav = require("../utilities/nav")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}

//login view
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilitiesnav.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

//registration view
 accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilitiesnav.getNav()
  res.render("./account/registration", {
    title: "Registration",
    nav,
    errors: null
  })
}

// account view
accountCont.buildAccount = async function (req, res, next) {
  const name = res.locals.accountData.enter_firstname
  const grid = `<h2>Welcome ${name}</h2>`
  let nav = await utilitiesnav.getNav();
  res.render("./account/index", {
    title: "Account",
    nav,
    grid,
    errors: null
  })
}

//registration 
accountCont.registerAccount = async function (req, res) {
  let nav = await utilitiesnav.getNav();
  const { enter_firstname, enter_lastname, enter_email, enter_password } = req.body;

  const regResult = await accountModel.registerAccount(
    enter_firstname,
    enter_lastname,
    enter_email,
    enter_password
  );
  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${enter_firstname}. Please log in.`
    );
    return res.redirect("/account/login");
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

//login
accountCont.accountLogin = async function (req, res) {
  let nav = await utilitiesnav.getNav()
  const { enter_email, enter_password } = req.body
  const accountLog = await accountModel.getAccount(enter_email)
  if (!accountLog) {
    
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      enter_email,
    })
    return
  }
  try {
    if (enter_password === accountLog.enter_password) {
      delete accountLog.enter_password
      const accessToken = jwt.sign(accountLog, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        enter_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

// logout
accountCont.logout = async function (req, res) {
  res.clearCookie("jwt");
  req.flash("notice", `You Logout`)
  res.redirect("/");
}

accountCont.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = accountCont