const express = require("express");

const {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  getBrand,
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
  .post(createBrandValidator, createBrand)
  .get(getBrands)
router
  .route("/:id")
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand)
  .get(getBrandValidator, getBrand);

module.exports = router;
