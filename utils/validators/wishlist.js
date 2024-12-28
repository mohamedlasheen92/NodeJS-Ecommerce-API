const { check } = require("express-validator")
const validatorMiddleware = require("../../middlewares/validator")
const Product = require("../../models/Product")

const addProductToWishlistValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID')
    .custom(async (value) => {
      //Check if product exists in DB
      const product = await Product.findById(value)
      if (!product)
        throw new Error('Product not found. Please check the ID and try again')

      return true
    }),


  validatorMiddleware,
]

const removeProductFromWishlistValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),

  validatorMiddleware,
]

module.exports = {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
}