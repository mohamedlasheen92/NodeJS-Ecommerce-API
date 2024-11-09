/* eslint-disable import/no-extraneous-dependencies */
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const Category = require("../models/Category")
const resourceOperations = require("./resourceOperations");
const { uploadSingleImage } = require('../middlewares/uploadImage');


// Temporarily saves image in memory for processing before storing it in the database
const uploadCategoryImage = uploadSingleImage('image')

const resizeCategoryImage = async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`)

    req.body.image = filename
  }

  next()
}



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
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
}