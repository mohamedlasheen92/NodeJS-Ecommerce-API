const express = require('express');

const { protect, allowedTo } = require('../controllers/authController');
const { addAddress, removeAddress, getLoggedUserAddresses } = require('../controllers/addressController');
const { addAddressValidator, removeAddressValidator } = require('../utils/validators/addressValidator');

const router = express.Router();

router.use(protect, allowedTo('user'))

router.post('/', addAddressValidator, addAddress)
router.delete('/:addressId', removeAddressValidator, removeAddress)
router.get('/', getLoggedUserAddresses)


module.exports = router