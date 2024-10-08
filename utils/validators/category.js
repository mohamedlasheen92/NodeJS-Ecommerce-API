const { check } = require("express-validator")
const validatorMiddleware = require("../../middlewares/validator")

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category Id format"),
  validatorMiddleware
]

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Category name must be between 3 and 30 characters long."),
  validatorMiddleware
]

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category Id format"),
  check('name').notEmpty().withMessage('Category name is required.')
    .isLength({ min: 3, max: 30 })
    .withMessage("Category name must be between 3 and 30 characters long."),
  validatorMiddleware
]
const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category Id format"),
  validatorMiddleware
]


module.exports = {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator
}