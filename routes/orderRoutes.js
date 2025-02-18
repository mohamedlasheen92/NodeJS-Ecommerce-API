const express = require('express');
const { createCashOrder, getAllOrders, getSpecificOrder, updateOrderToPaid, updateOrderToDelivered, getCheckoutSession } = require('../controllers/orderController');
const { protect, allowedTo } = require('../controllers/authController');
const { createCashOrderValidator, getSpecificOrderValidator } = require('../utils/validators/orderValidator');

const router = express.Router();

router.use(protect)

router.get('/checkout-session/:cartId', allowedTo('user'), getCheckoutSession)

router.route('/').post(allowedTo('user'), createCashOrderValidator, createCashOrder)
router.route('/')
  .get(allowedTo('admin', 'manager', 'user'), getAllOrders)

router.route('/:id')
  .get(allowedTo('admin', 'manager', 'user'), getSpecificOrderValidator, getSpecificOrder)

router.put('/:orderId/pay', allowedTo('admin', 'manager'), updateOrderToPaid)
router.put('/:orderId/deliver', allowedTo('admin', 'manager'), updateOrderToDelivered)

module.exports = router