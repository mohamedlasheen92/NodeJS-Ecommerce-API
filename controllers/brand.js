const slugify = require("slugify");

const Brand = require("../models/Brand");

const ApiError = require("../utils/apiError");




// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
const getBrands = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({})
    .skip(skip)
    .limit(limit)

  res
    .status(200)
    .json({ count: brands.length, page, data: brands });
};

// @desc    Get specific Brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
const getBrand = async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id)

  if (!brand)
    return next(new ApiError(`No Brand with Id ${id}`, 404));

  res.status(200).json(brand);
};

// @desc    Create specific Brand
// @route   POST /api/v1/brands/:id
// @access  Private
const createBrand = async (req, res, next) => {
  const { name } = req.body;

  const newBrand = await Brand.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json({ data: newBrand });
};

// @desc    Update Specific brand
// @route   UPDATE /api/v1/brands/:id
// @access  Private
const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand)
    return next(new ApiError(`No Brand with Id ${id}`, 404));

  res.status(200).json({ data: brand });
};

// @desc    Delete specific Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
const deleteBrand = async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand)
    return next(new ApiError(`No Brand with Id ${id}`, 404));

  res.status(204).send();
};

module.exports = {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
