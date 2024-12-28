const User = require("../models/User")

// @desc Add address
// @route POST /api/v1/address
// @access Protected/User
const addAddress = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { addresses: req.body }
  }, {
    new: true
  })
  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses
  })
}

// @desc Remove address
// @route DELETE /api/v1/address
// @access Protected/User
const removeAddress = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { addresses: { _id: req.params.addressId } }
  }, {
    new: true
  })

  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
    data: user.addresses
  })
}

// @desc Get logged user addresses
// @route GET /api/v1/address
// @access Protected/User
const getLoggedUserAddresses = async (req, res, next) => {
  const user = await User.findById(req.user._id)

  res.status(200).json({
    status: "success",
    data: user.addresses,
    count: user.addresses.length
  })
}


module.exports = {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,

}