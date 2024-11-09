/* eslint-disable import/no-extraneous-dependencies */
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');


const Brand = require("../models/Brand")
const resourceOperations = require("./resourceOperations");
const { uploadSingleImage } = require('../middlewares/uploadImage');


// Temporarily saves image in memory for processing before storing it in the database
const uploadBrandImage = uploadSingleImage('image')

const resizeBrandImage = async (req, res, next) => {
  if (req.file) {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/brands/${filename}`)

    req.body.image = filename
  }

  next()
}


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
  uploadBrandImage,
  resizeBrandImage,
};
