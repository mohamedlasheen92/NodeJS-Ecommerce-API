const express = require("express");

const { signup, login, forgotPassword, verifyPassResetCode, resetPassword } = require("../controllers/auth");
const { signupValidator, loginValidator, verifyPassResetCodeValidator, resetPasswordValidator } = require("../utils/validators/auth");


const router = express.Router()


router.post('/signup', signupValidator, signup)

router.post('/login', loginValidator, login)

router.post('/forgotPassword', forgotPassword)

router.post('/verifyResetCode', verifyPassResetCodeValidator, verifyPassResetCode)

router.put('/resetPassword', resetPasswordValidator, resetPassword)


module.exports = router;