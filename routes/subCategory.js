const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getSubCategory,
  createFilterObject,
  assignCategoryIdToBody,
} = require("../controllers/subCategory");

const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategory");
const { protect, allowedTo } = require("../controllers/auth");

// *** mergeParams: let us access params of other routes
// EX: We need to access categoryId param from subCategoryRouter
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(protect,
    allowedTo('admin', 'manager'), assignCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObject, getSubCategories)
router
  .route("/:id")
  .put(protect,
    allowedTo('admin', 'manager'), updateSubCategoryValidator, updateSubCategory)
  .delete(protect,
    allowedTo('admin'), deleteSubCategoryValidator, deleteSubCategory)

  .get(getSubCategoryValidator, getSubCategory);

module.exports = router;
