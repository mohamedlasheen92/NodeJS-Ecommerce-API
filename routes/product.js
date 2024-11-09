const express = require("express");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  uploadProductImgs,
  resizeProductImgs,
} = require("../controllers/product");
const {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductValidator,
} = require("../utils/validators/product");

const router = express.Router();

router
  .route("/")
  .post(
    uploadProductImgs,
    resizeProductImgs,
    createProductValidator,
    createProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .put(
    uploadProductImgs,
    resizeProductImgs,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct)
  .get(getProductValidator, getProduct);

module.exports = router;
