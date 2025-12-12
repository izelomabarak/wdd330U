const pool = require("../database/")

// cart
async function cart(enter_id){
  try {
    const sql = "SELECT * FROM cart_a WHERE enter_id = $1"
    const data = await pool.query(sql, [enter_id])
    return data.rows
  } catch (error) {
    return new Error("No matching cart found")
  }
}

//register in cart
 async function registerInCart(enter_id, item_id, cart_a_quantity){
  try {
    const sql = "INSERT INTO cart_a (enter_id, item_id, cart_a_quantity) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [enter_id, item_id, cart_a_quantity])
  } catch (error) {
    return error.message
  }
}

//ubdate quantity in cart
async function registerQuantityCart(enter_id, item_id, cart_a_quantity){
  try {
    const sql = "UPDATE cart_a SET cart_a_quantity = $1 WHERE enter_id = $2 AND item_id = $3 RETURNING *"
    return await pool.query(sql, [cart_a_quantity, enter_id, item_id])
  } catch (error) {
    return error.message
  }
}

// get info cart
async function getCart(enter_id){
  try {
    const sql = "SELECT * FROM cart_a a JOIN item b ON a.item_id = b.item_id WHERE a.enter_id = $1"
    const data = await pool.query(sql, [enter_id])
    return data.rows
  } catch (error) {
    return new Error("No matching cart found")
  }
}

// delet element of cart
async function deletElementCart(enter_id, item_id){
  try {
    const sql = "DELETE FROM cart_a WHERE enter_id = $1 AND item_id = $2"
    return await pool.query(sql, [enter_id, item_id])
  } catch (error) {
    return new Error("No matching cart found")
  }
}

// delet cart
async function deletCart(enter_id){
  try {
    const sql = "DELETE FROM cart_a WHERE enter_id = $1"
    return await pool.query(sql, [enter_id])
  } catch (error) {
    return new Error("No matching cart found")
  }
}

//register in payment
 async function registerPayment(enter_id, payment_a_name, payment_a_address, payment_a_expiration, payment_a_code){
  try {
    const sql = "INSERT INTO payment_a (enter_id, payment_a_name, payment_a_address, payment_a_expiration, payment_a_code) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    return await pool.query(sql, [enter_id, payment_a_name, payment_a_address, payment_a_expiration, payment_a_code])
  } catch (error) {
    return error.message
  }
}

module.exports = { cart, registerInCart, registerQuantityCart, getCart, deletElementCart, deletCart, registerPayment };