const Brand = require("../models/Brand")
const resourceOperations = require("./resourceOperations");




// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
const getBrands = resourceOperations.getAll(Brand, 'Brand')

// @desc    Get specific Brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
const getBrand = resourceOperations.getOne(Brand)

// @desc    Create specific Brand
// @route   POST /api/v1/brands/:id
// @access  Private
const createBrand = resourceOperations.createOne(Brand)

// @desc    Update Specific brand
// @route   UPDATE /api/v1/brands/:id
// @access  Private
const updateBrand = resourceOperations.updateOne(Brand)

// @desc    Delete specific Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
const deleteBrand = resourceOperations.deleteOne(Brand)

module.exports = {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
