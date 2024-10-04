const Category = require("../models/Category")

const createCategory = async (req, res) => {

  console.log(req.body)
  try {
    const newCategory = await Category.create(req.body)
    res.json({ newCategory, message: 'Category is created successfully!' })

  } catch (err) {
    res.json(err)
  }

}

module.exports = {
  createCategory
}