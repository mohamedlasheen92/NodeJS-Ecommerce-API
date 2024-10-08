const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategory,
} = require("../controllers/category");
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require("../utils/validators/category");
const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validator");
const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory)

  .get(getCategoryValidator, getCategory);

module.exports = router;
