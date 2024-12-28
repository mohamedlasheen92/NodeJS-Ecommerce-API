const { check } = require("express-validator");
const slugify = require("slugify");

const User = require("../../models/User");
const validatorMiddleware = require("../../middlewares/validator");

const signupValidator = [
  check('name')
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true
    }),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom(async (value) => {
      const result = await User.findOne({ email: value })
      if (result)
        throw new Error("Email already exists")
      return true
    }),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm)
        throw new Error("Password and confirmation do not match. Please correct this to proceed.")

      return true
    }),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('Confirm Password is required'),



  validatorMiddleware,
]

const loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm)
        throw new Error("Password and confirmation do not match. Please correct this to proceed.")

      return true
    }),

]

const verifyPassResetCodeValidator = [
  check('resetCode')
    .notEmpty()
    .withMessage('Reset code is required'),

  validatorMiddleware,
]

const resetPasswordValidator = [
  check('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm)
        throw new Error("New password and confirmation do not match. Please correct this to proceed.")

      return true
    }),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('Confirm Password is required'),



  validatorMiddleware,
]

module.exports = {
  signupValidator,
  loginValidator,
  verifyPassResetCodeValidator,
  resetPasswordValidator,
}