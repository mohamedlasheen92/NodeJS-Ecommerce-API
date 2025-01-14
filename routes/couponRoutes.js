const express = require('express');
const { getCoupons, createCoupon, getCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, allowedTo } = require("../controllers/authController");
const { createCouponValidator, getCouponValidator, updateCouponValidator, deleteCouponValidator } = require('../utils/validators/couponValidator');


const router = express.Router();

router.use(protect, allowedTo('admin', 'manager'))

router.route('/')
  .get(getCoupons)
  .post(createCouponValidator, createCoupon)

router.route('/:id')
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon)

module.exports = router