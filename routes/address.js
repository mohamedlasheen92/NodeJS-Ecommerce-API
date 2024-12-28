const express = require('express');

const { protect, allowedTo } = require('../controllers/auth');
const { addAddress, removeAddress, getLoggedUserAddresses } = require('../controllers/address');
const { addAddressValidator, removeAddressValidator } = require('../utils/validators/address');

const router = express.Router();

router.use(protect, allowedTo('user'))

router.post('/', addAddressValidator, addAddress)
router.delete('/:addressId', removeAddressValidator, removeAddress)
router.get('/', getLoggedUserAddresses)


module.exports = router