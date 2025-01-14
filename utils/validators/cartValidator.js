const { check } = require("express-validator")
const validatorMiddleware = require("../../middlewares/validator")
const Cart = require("../../models/Cart")

const removeItemFromCartValidator = [
  check('itemId')
    .isMongoId()
    .withMessage('Invalid item ID format')
    .custom(async (value, { req }) => {
      // Check if item is already in the cart
      const cart = await Cart.findOne({ user: req.user._id })
      const isItemExists = cart.cartItems.some(item => item._id.toString() === value)
      if (!isItemExists)
        throw new Error('Item not found in the cart. Please check the ID and try again')

      return true
    }),

  validatorMiddleware,
]

const updateCartItemQuantityValidator = [
  check('itemId')
    .isMongoId()
    .withMessage('Invalid item ID format')
    .custom(async (value, { req }) => {
      // Check if item is already in the cart
      const cart = await Cart.findOne({ user: req.user._id })
      const isItemExists = cart.cartItems.some(item => item._id.toString() === value)
      if (!isItemExists)
        throw new Error('Item not found in the cart. Please check the ID and try again')

      return true
    }),
  check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer'),


  validatorMiddleware,
]

const applyCouponValidator = [
  check('couponName')
    .notEmpty()
    .withMessage('Coupon name is required'),

  validatorMiddleware
]

module.exports = {
  removeItemFromCartValidator,
  updateCartItemQuantityValidator,
  applyCouponValidator,
}