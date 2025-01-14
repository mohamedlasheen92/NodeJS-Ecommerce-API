const express = require('express');
const { createCashOrder, getAllOrders, getSpecificOrder, updateOrderToPaid, updateOrderToDelivered } = require('../controllers/orderController');
const { protect, allowedTo } = require('../controllers/authController');
const { createCashOrderValidator, getSpecificOrderValidator } = require('../utils/validators/orderValidator');

const router = express.Router();


router.route('/').post(protect, allowedTo('user'), createCashOrderValidator, createCashOrder)
router.route('/')
  .get(protect, allowedTo('admin', 'manager', 'user'), getAllOrders)

router.route('/:id')
  .get(protect, allowedTo('admin', 'manager', 'user'), getSpecificOrderValidator, getSpecificOrder)

router.put('/:orderId/pay', protect, allowedTo('admin', 'manager'), updateOrderToPaid)
router.put('/:orderId/deliver', protect, allowedTo('admin', 'manager'), updateOrderToDelivered)

module.exports = router