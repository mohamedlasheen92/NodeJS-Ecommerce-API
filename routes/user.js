const express = require("express");
const {
  createUser,
  getUsers,
  uploadUserImage,
  resizeUserImage,
  updateUser,
  deleteUser,
  getUser,
  changeUserPassword,
} = require("../controllers/user");
const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/user");
const { protect, allowedTo } = require("../controllers/auth");

const router = express.Router();

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    createUser
  )
  .get(protect, allowedTo("admin", "manager"), getUsers);
router
  .route("/:id")
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadUserImage,
    resizeUserImage,
    updateUserValidator,
    updateUser
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser)
  .get(protect, allowedTo("admin", "manager"), getUserValidator, getUser);

module.exports = router;
