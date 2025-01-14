const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const Order = require("../../models/Order");

const createCashOrderValidator = [
  check('shippingAddress.phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone number format. Please enter a valid Egyptian mobile number'),

  check('shippingAddress.postalCode')
    .optional()
    .isPostalCode('any')
    .withMessage('Invalid postal code format. Please enter a valid'),


  validatorMiddleware,
]

const getSpecificOrderValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Order Id format')
    .custom(async (value, { req }) => {
      //Check if the orderId is valid - belongs to the user
      const order = await Order.findOne({
        _id: value,
        user: req.user._id.toString(),
      })
      if (!order)
        throw new Error('Order not found. Please check the ID and try again')

      return true
    }),

  validatorMiddleware,
]

module.exports = {
  createCashOrderValidator,
  getSpecificOrderValidator,

}