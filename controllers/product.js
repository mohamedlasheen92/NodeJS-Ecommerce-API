const slugify = require("slugify");

const Product = require("../models/Product");

const ApiError = require("../utils/apiError");




// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find({})
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'category',
      select: 'name'
    })

  res
    .status(200)
    .json({ count: products.length, page, data: products })

};

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id)

  if (!product)
    return next(new ApiError(`No Product with Id ${id}`, 404));

  res.status(200).json(product);
};

// @desc    Create specific product
// @route   POST /api/v1/products/:id
// @access  Private
const createProduct = async (req, res, next) => {
  req.body.slug = slugify(req.body.title)

  const newProduct = await Product.create(req.body);
  res.status(201).json({ data: newProduct });
};

// @desc    Update Specific Product
// @route   UPDATE /api/v1/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title)

  const product = await Product.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );
  if (!product)
    return next(new ApiError(`No Product with Id ${id}`, 404));

  res.status(200).json({ data: product });
};

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product)
    return next(new ApiError(`No Product with Id ${id}`, 404));

  res.status(204).send();
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
