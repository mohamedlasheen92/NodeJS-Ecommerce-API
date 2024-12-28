/* eslint-disable import/no-extraneous-dependencies */
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const { uploadSingleImage } = require("../middlewares/uploadImage");
const resourceOperations = require("./resourceOperations");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const { createToken } = require("../utils/jwtOperations");

// Temporarily saves image in memory for processing before storing it in the database
const uploadUserImage = uploadSingleImage("profileImage");

// Image Proccessing
const resizeUserImage = async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImage = filename;
  }

  next();
};

// *** ADMINS ***

// @desc    Get All Users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = resourceOperations.getAll(User, "User");

// @desc    Get Specific User By ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUser = resourceOperations.getOne(User);

// @desc    Create User
// @route   POST /api/v1/users/
// @access  Private/Admin
const createUser = resourceOperations.createOne(User);

// @desc    Update Specific User By ID
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    { new: true }
  );
  if (!document)
    return next(new ApiError(`No document with Id ${req.params.id}`, 404));

  res.status(200).json({ data: document });
};

// @desc    Delete Specific User By ID
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = resourceOperations.deleteOne(User);

// @desc    Change Specific User Password By ID
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
const changeUserPassword = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, Number(process.env.SALT_ROUNDS)),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!user)
    return next(new ApiError(`No document with Id ${req.params.id}`, 404));

  res.status(200).json({ data: user });
};

// *** LOGGED USERS ***

// @desc    Get Logged User Data
// @route   PUT /api/v1/users/getMe
// @access  Private/Protect
const getLoggedUserData = async (req, res, next) => {
  req.params.id = req.user._id

  next()
}

// @desc    Update Logged User Password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
const updateLoggedUserPassword = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    password: await bcrypt.hash(req.body.newPassword, Number(process.env.SALT_ROUNDS)),
    passwordChangedAt: Date.now(),
  },
    { new: true })

  const token = await createToken({ id: user._id })

  res.status(200).json({ data: user, token })
}

// @desc    Update Logged User Data
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
const updateLoggedUserData = async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
  }, { new: true })

  res.status(200).json({ data: updatedUser })
}

// @desc    Delete Logged User
// @route   PUT /api/v1/users/deleteMe
// @access  Private/Protect
const deleteLoggedUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    active: false
  }, { new: true })

  res.status(200).json({ status: 'Success', data: user })
}

// @desc    Delete Logged User
// @route   PUT /api/v1/users/activateMe
// @access  Private/Protect
const activateMyAccount = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    active: true
  }, { new: true })

  res.status(200).json({ status: 'Success', data: user })
}

module.exports = {
  uploadUserImage,
  resizeUserImage,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
  activateMyAccount,
};
