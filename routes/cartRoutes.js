const express = require('express');
const { addProductToCart, removeItemFromCart, getLoggedUserCart, updateCartItemQuantity, clearCart, applyCoupon } = require('../controllers/cartController');
const { protect, allowedTo } = require('../controllers/authController');
const { removeItemFromCartValidator, updateCartItemQuantityValidator, applyCouponValidator } = require('../utils/validators/cartValidator');

const router = express.Router();

router.use(protect, allowedTo('user'))

router.route('/')
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart)

router.put('/applyCoupon', applyCouponValidator, applyCoupon)

router.route('/:itemId')
  .delete(removeItemFromCartValidator, removeItemFromCart)
  .put(updateCartItemQuantityValidator, updateCartItemQuantity)

module.exports = router