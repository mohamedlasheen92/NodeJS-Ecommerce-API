const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const Review = require("../../models/Review");
const Product = require("../../models/Product");

const createReviewValidator = [
  check('title')
    .optional(),

  check('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5'),

  check('user')
    .isMongoId()
    .withMessage('Invalid user ID'),

  check('product')
    .isMongoId()
    .withMessage('Invalid product ID')
    .custom(async (value, { req }) => {
      //Check if product exists in DB
      const product = await Product.findById(value)
      if (!product) throw new Error('Product not found. Please check the ID and try again')

      //Check if this is the first time for this user to make rate wo the product
      const review = await Review.findOne({ user: req.user._id, product: value })
      if (review) throw new Error('User has already reviewed this product')

      return true
    }),


  validatorMiddleware
]

const updateReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review Id format")
    .custom(async (value, { req }) => {

      //Check if review is already existing
      const review = await Review.findById(value)
      if (!review)
        throw new Error('Review not found. Please check the ID and try again')

      //Check if user is the owner of the review
      if (req.user._id.toString() !== review.user._id.toString())
        throw new Error('You are not authorized to delete this review')


      return true

    }),
  check("title")
    .optional(),

  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5'),


  validatorMiddleware

]

const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review Id format"),
  validatorMiddleware
]


const deleteReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review Id format")
    .custom(async (value, { req }) => {
      if (req.user.role === 'user') {
        //Check if review is already existing
        const review = await Review.findById(value)
        if (!review)
          throw new Error('Review not found. Please check the ID and try again')

        //Check if user is the owner of the review
        if (req.user._id.toString() !== review.user._id.toString())
          throw new Error('You are not authorized to delete this review')


        return true
      }
    }),
  validatorMiddleware
]


module.exports = {
  createReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
}