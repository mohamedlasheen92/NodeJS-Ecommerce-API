const Product = require("../models/Product");
const resourceOperations = require("./resourceOperations");


// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
const getProducts = resourceOperations.getAll(Product, 'Product')

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = resourceOperations.getOne(Product)

// @desc    Create specific product
// @route   POST /api/v1/products/:id
// @access  Private
const createProduct = resourceOperations.createOne(Product)

// @desc    Update Specific Product
// @route   UPDATE /api/v1/products/:id
// @access  Private
const updateProduct = resourceOperations.updateOne(Product)

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteProduct = resourceOperations.deleteOne(Product)

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
