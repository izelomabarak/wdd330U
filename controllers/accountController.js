const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

//login view
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

//registration view
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/registration", {
    title: "Registration",
    nav,
    errors: null
  })
}

// account view
async function buildAccount (req, res, next) {
  const name = localStorage.getItem("accountName");
  const grid = `<h2>Welcome ${name}</h2>`
  res.render("./account/index", {
    title: "Account",
    nav,
    grid,
    errors: null
  })
}

//registration 
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
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
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { enter_email, enter_password } = req.body
  const acountLog = await accountModel.checkLoginAccount(enter_email, enter_password)
  if (!acountLog) {
    localStorage.setItem('accountName', acountLog.enter_firstname );
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  else {
    req.flash("message notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

// logout
async function logout(req, res) {
  localStorage.removeItem('accountName');
}


//error handeler
buildLogin.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
buildRegister.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
registerAccount.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
accountLogin.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
buildAccount.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
logout.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, logout }
