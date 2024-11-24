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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
  activateMyAccount,
} = require("../controllers/user");
const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserDataValidator,
  activateAccountValidator,
} = require("../utils/validators/user");
const { protect, allowedTo } = require("../controllers/auth");

const router = express.Router();


// *** LOGGED USER
router.get('/getMe', protect, getLoggedUserData, getUser)
router.put('/updateMyPassword', protect, updateLoggedUserPasswordValidator, updateLoggedUserPassword)
router.put('/updateMe', protect, updateLoggedUserDataValidator, updateLoggedUserData)
router.delete('/deleteMe', protect, deleteLoggedUser)
router.put('/activateMe', activateAccountValidator, activateMyAccount)


// *** ADMIN
router.put("/changePassword/:id", protect, allowedTo("admin", "manager"), changeUserPasswordValidator, changeUserPassword);

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
