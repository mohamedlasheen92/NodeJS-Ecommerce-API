const express = require('express');
const { addProductToWishlistValidator, removeProductFromWishlistValidator } = require('../utils/validators/wishlistValidator');
const { addProductToWishlist, removeProductFromWishlist, getLoggedUserWishlist } = require('../controllers/wishlistController');
const { protect, allowedTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect, allowedTo('user'))

router.post('/', addProductToWishlistValidator, addProductToWishlist)
router.delete('/', removeProductFromWishlistValidator, removeProductFromWishlist)
router.get('/', getLoggedUserWishlist)


module.exports = router