const mongoose = require('mongoose')

const { Schema, model } = mongoose

const couponSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Coupon name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Coupon name must be at least 3 characters long'],
    maxlength: [30, 'Coupon name cannot be more than 30 characters long']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Coupon expiry date is required'],
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Coupon discount percentage is required'],
    min: [0, 'Coupon discount percentage must be at least 1%'],
    max: [100, 'Coupon discount percentage cannot exceed 100%'],
  }

}, { timestamps: true })



const Coupon = model('Coupon', couponSchema)

module.exports = Coupon