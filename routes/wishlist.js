const express = require('express');
const { addProductToWishlistValidator, removeProductFromWishlistValidator } = require('../utils/validators/wishlist');
const { addProductToWishlist, removeProductFromWishlist, getLoggedUserWishlist } = require('../controllers/wishlist');
const { protect, allowedTo } = require('../controllers/auth');

const router = express.Router();

router.use(protect, allowedTo('user'))

router.post('/', addProductToWishlistValidator, addProductToWishlist)
router.delete('/', removeProductFromWishlistValidator, removeProductFromWishlist)
router.get('/', getLoggedUserWishlist)


module.exports = router