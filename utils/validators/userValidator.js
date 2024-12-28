const { check } = require("express-validator");
const slugify = require("slugify");
const User = require("../../models/User");
const validatorMiddleware = require("../../middlewares/validator");
const { verifyToken } = require("../jwtOperations");

// *** ADMINS ***

const createUserValidator = [
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

  check('phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone number format. Please enter a valid Egyptian mobile number'),

  check('profileImage').optional(),
  check('role').optional(),

  validatorMiddleware,
]

const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
]

const updateUserValidator = [
  check('id').isMongoId().withMessage("Invalid user id format"),
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true
    }),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom(async (value) => {
      const result = await User.findOne({ email: value })
      if (result)
        throw new Error("Email already exists")
      return true
    }),

  check('phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('"Invalid phone number format. Please enter a valid Egyptian mobile number'),

  check('profileImage').optional(),
  check('role').optional(),

  validatorMiddleware,
]

const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
]

const changeUserPasswordValidator = [
  check('id').isMongoId().withMessage("Invalid user id format"),
  check('currentPassword').notEmpty().withMessage('Current password is required'),
  check('newPassword').notEmpty().withMessage('New password is required')
    .custom(async (value, { req }) => {
      //Check if the user already exists
      const user = await User.findById(req.params.id)
      if (!user)
        throw new Error("User not found. Please check the ID and try again")

      //Compare the current password input with the user hashed password
      const isPasswordMatch = await user.verifyPassword(req.body.currentPassword)
      if (!isPasswordMatch)
        throw new Error("Incorrect current password. Please try again")


      //Check if new password matches password confirmation
      if (value !== req.body.passwordConfirm)
        throw new Error("Password and confirmation do not match. Please correct this to proceed.")

      return true
    }),
  check('passwordConfirm').notEmpty().withMessage('Password confirm is required'),

  validatorMiddleware,
]

// *** LOGGED USERS ***

const updateLoggedUserPasswordValidator = [
  check('currentPassword').notEmpty().withMessage('Current password is required'),
  check('newPassword').notEmpty().withMessage('New password is required')
    .custom(async (value, { req }) => {
      //Check if the user already exists
      const user = await User.findById(req.user._id)
      if (!user)
        throw new Error("No user found with this ID. The user account may be deleted")

      //Compare the current password input with the user hashed password
      const isPasswordMatch = await user.verifyPassword(req.body.currentPassword)
      if (!isPasswordMatch)
        throw new Error("Incorrect current password. Please try again")


      //Check if new password matches password confirmation
      if (value !== req.body.passwordConfirm)
        throw new Error("Password and confirmation do not match. Please correct this to proceed.")

      return true
    }),
  check('passwordConfirm').notEmpty().withMessage('Password confirm is required'),

  validatorMiddleware,
]

const updateLoggedUserDataValidator = [
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true
    }),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom(async (value) => {
      const result = await User.findOne({ email: value })
      if (result)
        throw new Error("Email already exists")
      return true
    }),
  check('phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone number format. Please enter a valid Egyptian mobile number'),

  validatorMiddleware
]

const activateAccountValidator = [
  check('Token')
    .custom(async (value, { req }) => {
      console.log(value);
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
        token = req.headers.authorization.split(' ')[1]

      if (!token)
        throw new Error('Unauthorized access. Missing or invalid token.')

      // Verify the token (ensure it has not been tampered with or expired)
      const payload = await verifyToken(token)


      // Confirm the token still belongs to an active user (the user might have been deleted)
      const user = await User.findById(payload.id)
      if (!user)
        throw new Error('Error: User no longer exists. Please log in again')

      req.user = user
    }),

  validatorMiddleware,
]




module.exports = {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserDataValidator,
  activateAccountValidator,
}