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

// *** mergeParams: let us access params of other routes
// EX: We need to access categoryId param from subCategoryRouter
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(assignCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObject, getSubCategories)
router
  .route("/:id")
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory)

  .get(getSubCategoryValidator, getSubCategory);

module.exports = router;
