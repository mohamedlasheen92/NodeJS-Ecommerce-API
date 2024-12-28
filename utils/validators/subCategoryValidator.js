const { check } = require("express-validator")
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validator");
const Category = require("../../models/Category");

const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory Id format"),
  validatorMiddleware
]

const createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory required')
    .isLength({ min: 2 })
    .withMessage('Too short Subcategory name')
    .isLength({ max: 32 })
    .withMessage('Too long Subcategory name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true
    }),
  check('parentCategory')
    .notEmpty()
    .withMessage('subCategory must belong to category')
    .isMongoId()
    .withMessage('Invalid Parent Category id format')
    .custom(async (parentId) => {
      const isExist = await Category.findById(parentId)
      if (!isExist)
        throw new Error(`No parent category with Id ${parentId}`)

      return true
    }),
  validatorMiddleware,
];

const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory Id format"),
  check('name').notEmpty().withMessage('SubCategory name is required.')
    .isLength({ min: 3, max: 30 })
    .withMessage("SubCategory name must be between 3 and 30 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true
    }),
  validatorMiddleware
]
const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory Id format"),
  validatorMiddleware
]


module.exports = {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator
}