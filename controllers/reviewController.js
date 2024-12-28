/* eslint-disable import/no-extraneous-dependencies */
const Review = require("../models/Review")
const resourceOperations = require("./resourceOperations");

// Middleware to filter reviews by product id
// GET /api/v1/products/:productId/reviews
const setProductIdToFilterObj = (req, res, next) => {
  if (req.params.productId)
    req.filterObj = { product: req.params.productId }

  next()
}

// Middleware to set product and user to request body
// POST /api/products/:productId/reviews
const setProductAndUserToBody = (req, res, next) => {
  if (!req.body.product)
    req.body.product = req.params.productId
  if (!req.body.user)
    req.body.user = req.user._id

  next()
}


// @desc    Get list of Reviews
// @route   GET /api/v1/reviews
// @access  Public
const getReviews = resourceOperations.getAll(Review)

// @desc    Get specific Review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
const getReview = resourceOperations.getOne(Review)

// @desc    Create specific Review
// @route   POST /api/v1/reviews/:id
// @access  Private/Protected(User)
const createReview = resourceOperations.createOne(Review)

// @desc    Update Specific Review
// @route   UPDATE /api/v1/reviews/:id
// @access  Private/Protected(User)
const updateReview = resourceOperations.updateOne(Review)

// @desc    Delete specific Review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protected(User)
const deleteReview = resourceOperations.deleteOne(Review)

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  setProductIdToFilterObj,
  setProductAndUserToBody,
};
