const slugify = require("slugify")
const Category = require("../models/Category")
const ApiError = require("../utils/apiError")

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = async (req, res, next) => {
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  const skip = (page - 1) * limit

  const categories = await Category.find({}).skip(skip).limit(limit)
  res.status(200).json({ count: categories.length, page, data: categories })
}

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategory = async (req, res, next) => {

  const { id } = req.params
  const category = await Category.findById(id)
  if (!category)
    return next(new ApiError(`No Category with Id ${id}`, 404))

  res.status(200).json(category)

}

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
const createCategory = async (req, res, next) => {
  const { name } = req.body

  const newCategory = await Category.create({ name, slug: slugify(name) })
  res.status(201).json({ data: newCategory })
}

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {

  const { id } = req.params
  const { name } = req.body
  const category = await Category.findOneAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true })
  if (!category)
    return next(new ApiError(`No Category with Id ${id}`, 404))

  res.status(200).json(category)

}

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {

  const { id } = req.params
  const category = await Category.findByIdAndDelete(id)
  if (!category)
    return next(new ApiError(`No Category with Id ${id}`, 404))

  res.status(204).send()

}


module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
}