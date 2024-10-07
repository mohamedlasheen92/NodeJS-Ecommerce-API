const express = require('express')
const { createCategory, getCategories, updateCategory, deleteCategory, getCategory } = require('../controllers/category')
const router = express.Router()

router.route('/').get(getCategories).post(createCategory)
router.route('/:id').put(updateCategory).delete(deleteCategory).get(getCategory)


module.exports = router