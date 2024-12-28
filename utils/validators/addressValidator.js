const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const User = require("../../models/User");

const addAddressValidator = [
  check('phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone number format. Please enter a valid Egyptian mobile number'),

  check('postalCode')
    .optional()
    .isPostalCode()
    .withMessage('Invalid postal code format. Please enter a valid'),

  check('alias')
    .optional()
    .custom(async (value) => {
      // Check if he adds an alias with the same name
      const user = await User.findOne({ "addresses.alias": value })

      if (user)
        throw new Error('Alias already exists. Please choose a different one')

      return true
    }),


  validatorMiddleware

]

const removeAddressValidator = [
  check('addressId')
    .notEmpty()
    .withMessage('Address ID is required')
    .isMongoId()
    .withMessage('Invalid address ID'),

  validatorMiddleware
]

module.exports = {
  addAddressValidator,
  removeAddressValidator,
}