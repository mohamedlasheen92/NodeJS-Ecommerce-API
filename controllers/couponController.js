/* eslint-disable import/no-extraneous-dependencies */
const Coupon = require("../models/Coupon")
const resourceOperations = require("./resourceOperations");


// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
const getCoupons = resourceOperations.getAll(Coupon, 'Coupon')

// @desc    Get specific Coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
const getCoupon = resourceOperations.getOne(Coupon)

// @desc    Create specific Coupon
// @route   POST /api/v1/coupons/:id
// @access  Private/Admin
const createCoupon = resourceOperations.createOne(Coupon)

// @desc    Update Specific Coupon
// @route   UPDATE /api/v1/coupons/:id
// @access  Private/Admin
const updateCoupon = resourceOperations.updateOne(Coupon)

// @desc    Delete specific Coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
const deleteCoupon = resourceOperations.deleteOne(Coupon)

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
