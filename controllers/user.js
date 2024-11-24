/* eslint-disable import/no-extraneous-dependencies */
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const { uploadSingleImage } = require("../middlewares/uploadImage");
const resourceOperations = require("./resourceOperations");
const User = require("../models/User");
const ApiError = require("../utils/apiError");

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



module.exports = {
  uploadUserImage,
  resizeUserImage,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
};
