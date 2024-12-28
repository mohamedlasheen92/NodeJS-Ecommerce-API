const User = require("../models/User")

// @desc Add product to wishlist
// @route POST /api/v1/wishlist
// @access Protected/User
const addProductToWishlist = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { wishlist: req.body.productId }
  }, {
    new: true
  })
  res.status(200).json({
    status: "success",
    message: "Product added to wishlist",
    data: user.wishlist
  })
}

// @desc Remove product from wishlist
// @route DELETE /api/v1/wishlist
// @access Protected/User
const removeProductFromWishlist = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { wishlist: req.body.productId }
  }, {
    new: true
  })
  res.status(200).json({
    status: "success",
    message: "Product removed from wishlist",
    data: user.wishlist
  })
}

// @desc Get logged user wishlist
// @route GET /api/v1/wishlist
// @access Protected/User
const getLoggedUserWishlist = async (req, res, next) => {
  const user = await User.findById(req.user._id)

  res.status(200).json({
    status: "success",
    data: user.wishlist,
    count: user.wishlist.length
  })
}


module.exports = {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,

}