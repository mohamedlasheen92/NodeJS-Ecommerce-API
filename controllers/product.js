const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const Product = require("../models/Product");
const resourceOperations = require("./resourceOperations");
const { uploadMultipleImages } = require('../middlewares/uploadImage');



// Temporarily saves image in memory for processing before storing it in the database
const uploadProductImgs = uploadMultipleImages([{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 5 }])

const resizeProductImgs = async (req, res, next) => {
  if (req.files.imageCover) {
    const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;

    sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${filename}`)

    req.body.imageCover = filename
  }
  if (req.files.images) {
    const productImages = []
    req.files.images.forEach((img, idx) => {
      const filename = `product-${uuidv4()}-${Date.now()}-${idx}.jpeg`;

      sharp(img.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${filename}`)

      productImages.push(filename)
    })
    req.body.images = productImages
  }

  next()
}



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
  uploadProductImgs,
  resizeProductImgs,
};
