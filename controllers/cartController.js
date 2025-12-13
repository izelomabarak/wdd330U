const utilitiesnav = require("../utilities/nav")
const utilities = require("../utilities/")
const cartModel = require("../models/cart-model")

const cartCont = {}

//cart view
cartCont.buildCart = async function (req, res, next) {
  let id = res.locals.accountData.enter_id
  let exchange = req.session.currency || "USD"
  let data = await cartModel.getCart(id)
  let nav = await utilitiesnav.getNav()
  let elements = await utilities.getCart(data, exchange)
  let total = await utilities.getTotal(data, exchange)
  res.render("./cart/", {
    title: "Your Cart",
    nav,
    elements, 
    total,
    errors: null
  })
}

//buy view
cartCont.buildBuy = async function (req, res, next) {
  let id = res.locals.accountData.enter_id
  let exchange = req.session.currency || "USD"
  let data = await cartModel.getCart(id)
  let total = await utilities.getTotal(data, exchange)
  let nav = await utilitiesnav.getNav()
  res.render("./cart/buy", {
    title: "Buy Your Cart",
    nav,
    total,
    errors: null
  })
}

//add
cartCont.addCart = async function (req, res, next) {
  let enter_id = res.locals.accountData.enter_id
  const { item_id } = req.body
  let info = await cartModel.cart(enter_id)
  let number = 0
  let repeted = 0
  info.forEach(element => {
    if (element.item_id == item_id){
        number = element.cart_a_quantity
        repeted = 1
    }
  });
  if (repeted === 1){
    number = parseFloat(number)
    number = number + 1
    let ubdated = await cartModel.registerQuantityCart(enter_id, item_id, number)
    let nav = await utilitiesnav.getNav()
    let data = await cartModel.getCart(enter_id)
    let elements = await utilities.getCart(data)
    let total = await utilities.getTotal(data)
    req.flash("notice", "Product Add to Cart")
    res.render("./cart/", {
        title: "Your Cart",
        nav,
        elements, 
        total,
        errors: null
    })
  } else {
    let ubdated = await cartModel.registerInCart(enter_id, item_id, 1)
    let nav = await utilitiesnav.getNav()
    let data = await cartModel.getCart(enter_id)
    let elements = await utilities.getCart(data)
    let total = await utilities.getTotal(data)
    req.flash("notice", "Product Add to Cart")
    res.render("./cart/", {
        title: "Your Cart",
        nav,
        elements, 
        total,
        errors: null
    })
  }
}

//eliminate
cartCont.eliminateCart = async function (req, res, next) {
  let enter_id = res.locals.accountData.enter_id
  const { item_id } = req.body
  let info = await cartModel.cart(enter_id)
  let number = 0
  info.forEach(element => {
    if (element.item_id == item_id){
        number = element.cart_a_quantity
    }
  });
  if (parseFloat(number) === 1){
    let ubdated = await cartModel.deletElementCart(enter_id, item_id)
    let nav = await utilitiesnav.getNav()
    let data = await cartModel.getCart(enter_id)
    let elements = await utilities.getCart(data)
    let total = await utilities.getTotal(data)
    req.flash("notice", "Product Eliminated to Cart")
    res.render("./cart/", {
        title: "Your Cart",
        nav,
        elements, 
        total,
        errors: null
    })
  } else {
    number = parseFloat(number)
    number = number - 1
    let ubdated = await cartModel.registerQuantityCart(enter_id, item_id, number)
    let nav = await utilitiesnav.getNav()
    let data = await cartModel.getCart(enter_id)
    let elements = await utilities.getCart(data)
    let total = await utilities.getTotal(data)
    req.flash("notice", "Product Eliminated to Cart")
    res.render("./cart/", {
        title: "Your Cart",
        nav,
        elements, 
        total,
        errors: null
    })
  }
}

//fulfit payment 
cartCont.registerPayment = async function (req, res) {
  let nav = await utilitiesnav.getNav();
  const { firstname, lastname, street, city, state, zip, payment_a_expiration, payment_a_code } = req.body
  const payment_a_name = firstname + lastname
  const payment_a_address = street + city + state + zip
  const enter_id = res.locals.accountData.enter_id
  const regResult = await cartModel.registerPayment(
    enter_id,
    payment_a_name,
    payment_a_address,
    payment_a_expiration,
    payment_a_code
  );
  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you'r payment was sucsesfuld`
    );
    return res.redirect("/");
  } else {
    req.flash("notice", "Sorry, the payment faild");
    let id = res.locals.accountData.enter_id
    let data = await cartModel.getCart(id)
    let total = await utilities.getTotal(data)
    return res.status(500).render("/cart/buy", {
    title: "Login",
    nav,
    total,
    errors: null,
    firstname, 
    lastname, 
    street, 
    city, 
    state, 
    zip, 
    payment_a_expiration, 
    payment_a_code
  })
  }
}

module.exports = cartCont