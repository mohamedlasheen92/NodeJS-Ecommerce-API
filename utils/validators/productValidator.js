const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validator");
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");

const createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Product description must be at least 20 characters long"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a numeric value"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a numeric value"),
  check("price")
    .notEmpty()
    .withMessage("Product pice is required")
    .isNumeric()
    .withMessage("Product price must be a numeric value")
    .isLength({ max: 200000 })
    .withMessage("Product price must not exceed 200,000."),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price after discount must be a numeric value")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "Product price after discount must be less than the original price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be provided as an array"),
  check("imageCover").notEmpty().withMessage("Product cover image is required"),
  check("category")
    .notEmpty()
    .withMessage(
      "Product category is required, product must belong to category"
    )
    .isMongoId()
    .withMessage("Invalid Cataegory Id Format")
    .custom(async (value) => {
      const isIdExist = await Category.findById(value);
      if (!isIdExist) throw new Error(`No category with id ${value}`);
      return true;
    }),

  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCataegories Id Format")
    .isArray()
    .withMessage("Product subcategories must be provided as an array")
    .custom(async (value, { req }) => {
      //Check if subCategories exists in DB
      const subs = await SubCategory.find({ _id: { $in: value } });
      if (value.length !== subs.length)
        throw new Error(
          "One or more subcategories do not exist in the database"
        );

      //Check if all subcategories related to the parent category
      const subsOfParent = await SubCategory.find({
        parentCategory: req.body.category,
      });
      const subsOfCategory = [];
      subsOfParent.forEach((doc) => subsOfCategory.push(doc._id.toString()));
      const isAllIdsRelated = value.every((id) => subsOfCategory.includes(id));
      if (!isAllIdsRelated)
        throw new Error(
          "Some subcategories do not belong to the specified parent category"
        );

      return true;
    }),

  check("brand").optional().isMongoId().withMessage("Invalid brand Id Format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratings average must be a numeric value")
    .isLength({ min: 1, max: 5 })
    .withMessage("Product ratings average must be between 1 and 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratings quantity must be a numeric value"),
  validatorMiddleware,
];

const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);

      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Product description must be at least 20 characters long"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a numeric value"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a numeric value"),
  check("price")
    .notEmpty()
    .withMessage("Product pice is required")
    .isNumeric()
    .withMessage("Product price must be a numeric value")
    .isLength({ max: 200000 })
    .withMessage("Product price must not exceed 200,000."),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price after discount must be a numeric value")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "Product price after discount must be less than the original price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be provided as an array"),
  check("imageCover").notEmpty().withMessage("Product cover image is required"),
  check("category")
    .notEmpty()
    .withMessage(
      "Product category is required, product must belong to category"
    )
    .isMongoId()
    .withMessage("Invalid Cataegory Id Format")
    .custom(async (value) => {
      const isIdExist = await Category.findById(value);
      if (!isIdExist) throw new Error(`No category with id ${value}`);
      return true;
    }),

  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCataegories Id Format")
    .isArray()
    .withMessage("Product subcategories must be provided as an array")
    .custom(async (value, { req }) => {
      //Check if subCategories exists in DB
      const subs = await SubCategory.find({ _id: { $in: value } });
      if (value.length !== subs.length)
        throw new Error(
          "One or more subcategories do not exist in the database"
        );

      //Check if all subcategories related to the parent category
      const subsOfParent = await SubCategory.find({
        parentCategory: req.body.category,
      });
      const subsOfCategory = [];
      subsOfParent.forEach((doc) => subsOfCategory.push(doc._id.toString()));
      const isAllIdsRelated = value.every((id) => subsOfCategory.includes(id));
      if (!isAllIdsRelated)
        throw new Error(
          "Some subcategories do not belong to the specified parent category"
        );

      return true;
    }),
  check("brand").optional().isMongoId().withMessage("Invalid brand Id Format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratings average must be a numeric value")
    .isLength({ min: 1, max: 5 })
    .withMessage("Product ratings average must be between 1 and 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratings quantity must be a numeric value"),
  validatorMiddleware,
];

const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  getProductValidator,
  deleteProductValidator,
};
