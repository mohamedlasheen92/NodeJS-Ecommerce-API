const Cart = require("../models/Cart")
const Order = require("../models/Order")
const Product = require("../models/Product")
const ApiError = require("../utils/apiError")
const resourceOperations = require("./resourceOperations");


// @desc    Create Cash Order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
const createCashOrder = async (req, res, next) => {
  const taxPrice = 0
  const shippingPrice = 0

  //Get user cart
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart)
    return next(new ApiError('No cart found for the provided user ID', 404))

  //Get total price and check if a coupon applied
  const cartPrice = cart.totalCartPriceAfterDiscount ? cart.totalCartPriceAfterDiscount : cart.totalCartPrice
  //Calculate total price including tax and shipping
  const totalPrice = cartPrice + taxPrice + shippingPrice

  //Create order
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: totalPrice
  })

  //Update quantity and sold amount for the product
  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
    }
  }));
  await Product.bulkWrite(bulkOption, {})

  //Clear the cart
  await Cart.findByIdAndDelete(cart._id)

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order
  })

}

const filterOrdersForLoggedUser = async (req, res, next) => {
  if (req.user.role === 'user')
    req.filterObj = { user: req.user._id }

  next()
}

// @desc    Get All Orders
// @route   GET /api/v1/orders
// @access  Protected/Admin-Manager
const getAllOrders = resourceOperations.getAll(Order)

// @desc    Get Specific Order
// @route   GET /api/v1/orders/:orderId
// @access  Protected/Admin-Manager-User
const getSpecificOrder = resourceOperations.getOne(Order)

// @desc    Update Specific Order to Paid
// @route   PUT /api/v1/orders/:orderId/pay
// @access  Protected/Admin-Manager
const updateOrderToPaid = async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.orderId)
  if (!order)
    return next(new ApiError('No order found for the provided ID', 404))

  order.isPaid = true
  order.paidAt = Date.now()

  await order.save()

  res.status(200).json({
    status: "success",
    message: "Order marked as paid",
    data: order
  })
}

// @desc    Update Specific Order to Paid
// @route   PUT /api/v1/orders/:orderId/deliver
// @access  Protected/Admin-Manager
const updateOrderToDelivered = async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.orderId)
  if (!order)
    return next(new ApiError('No order found for the provided ID', 404))

  order.isDelivered = true
  order.deliveredAt = Date.now()

  await order.save()

  res.status(200).json({
    status: "success",
    message: "Order marked as paid",
    data: order
  })
}


module.exports = {
  createCashOrder,
  getAllOrders,
  filterOrdersForLoggedUser,
  getSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,

}