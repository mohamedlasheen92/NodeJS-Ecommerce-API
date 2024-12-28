const express = require("express");

const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReview,
  setProductIdToFilterObj,
  setProductAndUserToBody,


} = require("../controllers/review");


const { protect, allowedTo } = require("../controllers/auth");
const { createReviewValidator, getReviewValidator, deleteReviewValidator, updateReviewValidator } = require("../utils/validators/review");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    allowedTo("user"),
    setProductAndUserToBody,
    createReviewValidator,
    createReview
  )
  .get(setProductIdToFilterObj, getReviews);
router
  .route("/:id")
  .put(
    protect,
    allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(protect, allowedTo("user", "admin"), deleteReviewValidator, deleteReview)
  .get(getReviewValidator, getReview);

module.exports = router;
