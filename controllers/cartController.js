const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const Product = require("../models/Product");
const ApiError = require("../utils/apiError");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalCartPriceAfterDiscount = undefined
}

// @desc    Add Product to Cart
// @route   POST /api/v1/cart
// @access  Private/User
const addProductToCart = async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId)
  if (!product)
    return next(new ApiError('No product found matching the provided ID', 404))

  let cart = await Cart.findOne({ user: req.user._id })
  let statusCode = 200

  if (!cart) {
    cart = await Cart.create({
      cartItems: [{ product: productId, price: product.price, color }],
      user: req.user._id,
    })
    statusCode = 201;
  } else {
    //Check if product exist in cart, Increase Quantity
    const productIndex = cart.cartItems.findIndex(item => (item.product.toString() === productId) && (item.color === color));
    if (productIndex > -1) {
      //Product already exists
      cart.cartItems[productIndex].quantity += 1;
    } else {
      //Product does not exist in cart
      cart.cartItems.push({ product: productId, price: product.price, color });
    }
  }

  calcTotalCartPrice(cart)

  await cart.save();

  res.status(statusCode).json({
    status: "success",
    message: statusCode === 201 ? "Cart created and product added successfully" : "Product added to cart successfully",
    count: cart.cartItems.length,
    data: cart,
  })
}

// @desc    Remove Product from Cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
const removeItemFromCart = async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate({ user: req.user._id }, {
    $pull: { cartItems: { _id: req.params.itemId } }
  }, { new: true })

  if (!cart)
    return next(new ApiError('No cart found for the provided user ID', 404))

  calcTotalCartPrice(cart)
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product removed from cart successfully",
    count: cart.cartItems.length,
    data: cart,
  })
}

// @desc    Get Logged User Cart
// @route   GET /api/v1/cart
// @access  Private/User
const getLoggedUserCart = async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart)
    return next(new ApiError('No cart found for the provided user ID', 404))

  res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    count: cart.cartItems.length,
    data: cart,
  })
}

// @desc    Update Cart Item Quantity
// @route   GET /api/v1/cart/:itemId
// @access  Private/User
const updateCartItemQuantity = async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart)
    return next(new ApiError('No cart found for the provided user ID', 404))

  const productIndex = cart.cartItems.findIndex(item => item._id.toString() === req.params.itemId);
  if (productIndex > -1)
    cart.cartItems[productIndex].quantity = quantity;
  else
    return next(new ApiError('No item found with the provided ID in the cart', 404))

  calcTotalCartPrice(cart)
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart item quantity updated successfully",
    count: cart.cartItems.length,
    data: cart,
  })
}

// @desc    Clear The Cart
// @route   GET /api/v1/cart
// @access  Private/User
const clearCart = async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id })
  if (!cart)
    return next(new ApiError('No cart found for the provided user ID', 404))

  res.status(204).json()
}

// @desc    Apply Coupon
// @route   GET /api/v1/cart/applyCoupon
// @access  Private/User

const applyCoupon = async (req, res, next) => {
  const { couponName } = req.body
  const coupon = await Coupon.findOne({ name: couponName, expiryDate: { $gt: Date.now() } })
  if (!coupon)
    return next(new ApiError('No coupon found matching the provided name or expired', 404))

  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart)
    return next(new ApiError('No cart found for the provided user ID', 404))

  const totalPrice = cart.totalCartPrice
  cart.totalCartPriceAfterDiscount = (cart.totalCartPrice - ((totalPrice * coupon.discountPercentage) / 100)).toFixed(2)

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    count: cart.cartItems.length,
    data: cart,
  })
}


module.exports = {
  addProductToCart,
  removeItemFromCart,
  getLoggedUserCart,
  updateCartItemQuantity,
  clearCart,
  applyCoupon,
}