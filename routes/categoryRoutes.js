const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../controllers/categoryController");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const subCategoryRoute = require("./subCategoryRoutes");
const { protect, allowedTo } = require("../controllers/authController");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory)

  .get(getCategoryValidator, getCategory);

module.exports = router;
