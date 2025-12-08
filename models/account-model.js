const { accountLogin } = require("../controllers/accountController")
const pool = require("../database/")

//register account
 async function registerAccount(enter_firstname, enter_lastname, enter_email, enter_password){
  try {
    const sql = "INSERT INTO enter (enter_firstname, enter_lastname, enter_email, enter_password) VALUES ($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [enter_firstname, enter_lastname, enter_email, enter_password])
  } catch (error) {
    return error.message
  }
}

// existent account
async function checkExistingAccount(enter_email){
  try {
    const sql = "SELECT * FROM enter WHERE enter_email = $1"
    const email = await pool.query(sql, [enter_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

//login account
async function checkLoginAccount(enter_email, enter_password){
  try {
    const sql = "SELECT * FROM enter WHERE enter_email = $1 AND enter_password = $2"
    const email = await pool.query(sql, [enter_email, enter_password])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = { registerAccount, checkExistingAccount, checkLoginAccount };