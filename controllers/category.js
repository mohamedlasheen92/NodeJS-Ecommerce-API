const Category = require("../models/Category")
const resourceOperations = require("./resourceOperations");

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = resourceOperations.getAll(Category, 'Category')

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategory = resourceOperations.getOne(Category)

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
const createCategory = resourceOperations.createOne(Category)

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
const updateCategory = resourceOperations.updateOne(Category)

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
const deleteCategory = resourceOperations.deleteOne(Category)


module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
}