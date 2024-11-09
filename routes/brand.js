const express = require("express");

const {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  getBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../controllers/brand");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brand")


const router = express.Router()


router
  .route("/")
  .post(uploadBrandImage, resizeBrandImage, createBrandValidator, createBrand)
  .get(getBrands)
router
  .route("/:id")
  .put(uploadBrandImage, resizeBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand)
  .get(getBrandValidator, getBrand);

module.exports = router;
