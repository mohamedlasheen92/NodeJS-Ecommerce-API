const slugify = require("slugify");

const SubCategory = require("../models/SubCategory");

const ApiError = require("../utils/apiError");


const createFilterObject = (req, res, next) => {
  let filterObj = {}
  if (req.params.categoryId) {
    filterObj = { parentCategory: req.params.categoryId }
  }
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
const getSubCategories = async (req, res, next) => {


  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find(req.filterObj)
    .skip(skip)
    .limit(limit)
    .populate({ path: "parentCategory", select: "name -_id" });
  res
    .status(200)
    .json({ count: subCategories.length, page, data: subCategories });
};

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
const getSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id).populate({
    path: "parentCategory",
    select: "name -_id",
  });
  if (!subCategory)
    return next(new ApiError(`No SubCategory with Id ${id}`, 404));

  res.status(200).json(subCategory);
};

// @desc    Create subcategory
// @route   POST /api/v1/subcategories/
// @access  Private
const createSubCategory = async (req, res, next) => {

  const { name, parentCategory } = req.body;

  const newSubCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    parentCategory,
  });
  res.status(201).json({ data: newSubCategory });
};

// @desc    Update Specific subcategory
// @route   UPDATE /api/v1/subcategories/:id
// @access  Private
const updateSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, parentCategory } = req.body;

  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), parentCategory },
    { new: true }
  );
  if (!subCategory)
    return next(new ApiError(`No SubCategory with Id ${id}`, 404));

  res.status(200).json({ data: subCategory });
};

// @desc    Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
const deleteSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory)
    return next(new ApiError(`No SubCategory with Id ${id}`, 404));

  res.status(204).send();
};

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createFilterObject,
  assignCategoryIdToBody
};
