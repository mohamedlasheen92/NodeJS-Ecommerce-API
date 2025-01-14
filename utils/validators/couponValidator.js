const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const Coupon = require("../../models/Coupon");

const createCouponValidator = [
  check('name')
    .notEmpty()
    .withMessage('Coupon name is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Coupon name must be between 3 and 30 characters long')
    .custom(async (value) => {
      // Check if coupon name is already in the Database
      const coupon = await Coupon.findOne({ name: value })
      if (coupon)
        throw new Error('Coupon name already exists')

      return true
    }),
  check('discountPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Coupon discount percentage must be a number between 0 and 100'),

  validatorMiddleware
]

const updateCouponValidator = [
  check('id').isMongoId().withMessage('Invalid Coupon Id format'),
  check('name')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Coupon name must be between 3 and 30 characters long'),
  check('discountPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Coupon discount percentage must be a number between 0 and 100'),

  validatorMiddleware
]

const getCouponValidator = [
  check('id').isMongoId().withMessage('Invalid Coupon Id format'),
  validatorMiddleware
]

const deleteCouponValidator = [
  check('id').isMongoId().withMessage('Invalid Coupon Id format'),
  validatorMiddleware
]

module.exports = {
  createCouponValidator,
  getCouponValidator,
  deleteCouponValidator,
  updateCouponValidator,
}