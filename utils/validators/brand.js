const { check } = require("express-validator")
const validatorMiddleware = require("../../middlewares/validator");


const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id format"),
  validatorMiddleware
]

const createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand required')
    .isLength({ min: 3 })
    .withMessage('Too short Brand name')
    .isLength({ max: 32 })
    .withMessage('Too long Brand name'),

  validatorMiddleware,
];

const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id format"),
  check('name').notEmpty().withMessage('Brand name is required.')
    .isLength({ min: 3, max: 30 })
    .withMessage("Brand name must be between 3 and 30 characters long."),
  validatorMiddleware
]
const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id format"),
  validatorMiddleware
]


module.exports = {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator
}