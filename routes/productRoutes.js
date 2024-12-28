const express = require("express");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  uploadProductImgs,
  resizeProductImgs,
} = require("../controllers/productController");
const {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductValidator,
} = require("../utils/validators/productValidator");
const { protect, allowedTo } = require("../controllers/authController");

const reviewRoute = require("./reviewRoutes");

const router = express.Router();

router.use('/:productId/reviews', reviewRoute)

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImgs,
    resizeProductImgs,
    createProductValidator,
    createProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImgs,
    resizeProductImgs,
    updateProductValidator,
    updateProduct
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  )
  .get(getProductValidator, getProduct);

module.exports = router;
