const SubCategory = require("../models/SubCategory");
const resourceOperations = require("./resourceOperations");


const createFilterObject = (req, res, next) => {
  let filterObj = {}
  if (req.params.categoryId)
    filterObj = { parentCategory: req.params.categoryId }

  req.filterObj = filterObj

  next()
}
const assignCategoryIdToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.parentCategory)
    req.body.parentCategory = req.params.categoryId

  next()
}


// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
const getSubCategories = resourceOperations.getAll(SubCategory, 'SubCategory')

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
const getSubCategory = resourceOperations.getOne(SubCategory)

// @desc    Create subcategory
// @route   POST /api/v1/subcategories/
// @access  Private
const createSubCategory = resourceOperations.createOne(SubCategory)

// @desc    Update Specific subcategory
// @route   UPDATE /api/v1/subcategories/:id
// @access  Private
const updateSubCategory = resourceOperations.updateOne(SubCategory)

// @desc    Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
const deleteSubCategory = resourceOperations.deleteOne(SubCategory)

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createFilterObject,
  assignCategoryIdToBody
};
