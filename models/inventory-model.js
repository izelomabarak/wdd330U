const pool = require("../database/")

// get category
async function getCategory(){
  return await pool.query("SELECT * FROM public.category ORDER BY category_name")
}

// get category items
async function getCategoryItems(category_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.item AS i 
      JOIN public.category AS c 
      ON i.category_id = c.category_id 
      WHERE i.category_id = $1`,
      [category_id]
    )
    return data.rows
  } catch (error) {
    console.error("getCategoryItems error " + error)
  }
  console.log(data)
}

// get agrochemicals items
async function getAgrochemicalsById(item_Id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.item 
      WHERE item_id = $1`,
      [item_Id]
    )
    return data.rows
  } catch (error) {
    console.error("getAgrochemicalsById error " + error)
  }
}

// errors handeler
getCategory.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
getCategoryItems.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
getAgrochemicalsById.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = {getCategory, getCategoryItems, getAgrochemicalsById };