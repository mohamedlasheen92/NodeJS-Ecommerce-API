const express = require("express");

const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReview,
  setProductIdToFilterObj,
  setProductAndUserToBody,


} = require("../controllers/reviewController");


const { protect, allowedTo } = require("../controllers/authController");
const { createReviewValidator, getReviewValidator, deleteReviewValidator, updateReviewValidator } = require("../utils/validators/reviewValidator");

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
