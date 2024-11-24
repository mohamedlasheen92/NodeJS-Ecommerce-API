const crypto = require('crypto');

const User = require("../models/User")
const ApiError = require("../utils/apiError")
const { createToken, verifyToken } = require("../utils/jwtOperations");
const sendEmail = require('../utils/sendEmail');

// @desc Signup
// @route POST /api/v1/auth/signup
// @access Public
const signup = async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })

  const token = await createToken({ id: user._id })

  res.status(201).json({ data: user, token })
}

// @desc Login
// @route POST /api/v1/auth/login
// @access Public
const login = async (req, res, next) => {
  //Check if user email already exists
  //Check on the password of this email
  const user = await User.findOne({ email: req.body.email })
  if (!user || !(await user.verifyPassword(req.body.password)))
    return next(new ApiError('Incorrect email or password', 401));

  //Generate token for this user
  const token = await createToken({ id: user._id })

  //Send the token
  res.status(200).json({ data: user, token })
}

// @desc Make sure the user is authenticated(logged in)
const protect = async (req, res, next) => {
  // Check if there is a JWT token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
    token = req.headers.authorization.split(' ')[1]

  if (!token)
    return next(new ApiError('Unauthorized access. Missing or invalid token.', 401));

  // Verify the token (ensure it has not been tampered with or expired)
  const payload = await verifyToken(token)


  // Confirm the token still belongs to an active user (the user might have been deleted)
  const user = await User.findById(payload.id)
  if (!user)
    return next(new ApiError('Error: User no longer exists. Please log in again', 401));

  if (!user.active)
    return next(new ApiError('Your account is inactive. Please activate your account to proceed', 403));

  // Check if the user has changed their password after the token was created, making the current token invalid
  if (user.passwordChangedAt) {
    const passwordChangedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000)

    if (passwordChangedTimestamp > payload.iat)
      return next(new ApiError('Error: User has changed their password. Please log in again', 401));
  }

  // If the user is authenticated and not expired, attach the user object to the request
  req.user = user
  next()

}

// @desc    Authorization (User Permissions)
// ["admin", "manager"]
const allowedTo = (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new ApiError('Unauthorized access. You are not allowed to perform this action.', 403));

    next()
  }


// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
const forgotPassword = async (req, res, next) => {
  // Check if user email already exists
  const user = await User.findOne({ email: req.body.email })
  if (!user)
    return next(new ApiError('No user found with this email address', 404));

  // Generate a random 6 digits and set it to expire in 10 minutes
  const passResetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassResetCode = crypto.createHash('sha256').update(passResetCode).digest('hex')

  user.passwordResetCode = hashedPassResetCode
  user.passwordResetCodeVerified = false
  user.passwordResetCodeExpiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

  await user.save()

  // Send reset code via email
  const message = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #fff;
            margin: 50px auto;
            padding: 20px;
            max-width: 600px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .content {
            line-height: 1.6;
            color: #333;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            color: #d9534f;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hi ${user.name},</p>
            <p>We received a request to reset the password on your Ecommerce Account.</p>
            <div class="code">${passResetCode}</div>
            <p>Enter this code to complete the reset.</p>
            <p>Thanks for helping us keep your account secure.</p>
            <p>The Ecommerce Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Ecommerce. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: 'Please use the following code to reset your password:',
      html: message,
    })
  } catch (err) {
    user.passwordResetCode = undefined
    user.passwordResetCodeVerified = undefined
    user.passwordResetCodeExpiresAt = undefined

    await user.save()

    return next(new ApiError('There is an error in sending email', 500))
  }

  res.status(200).json({
    status: 'Success',
    message: 'Password reset code has been sent to your email address',
  })
}

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
const verifyPassResetCode = async (req, res, next) => {
  // Validate and hash the reset code sent by the user
  const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');

  // Check if password reset code is valid and not expired
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    // passwordResetCodeExpiresAt: { $gt: Date.now() },
  });
  if (!user)
    return next(new ApiError('Invalid password reset code', 400));

  if (user.passwordResetCodeExpiresAt < Date.now())
    return next(new ApiError('Password reset code has expired', 400));

  // If the code is valid, mark it as verified and update the user's password
  user.passwordResetCodeVerified = true;

  await user.save();

  res.status(200).json({
    status: 'Success',
    message: 'Password reset code has been verified',
  })
}

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
const resetPassword = async (req, res, next) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email })
  if (!user)
    return next(new ApiError('No user found with this email address', 404));

  // Check if reset password code verified
  if (!user.passwordResetCodeVerified)
    return next(new ApiError('Password reset code has not been verified', 400));

  // Set the new password
  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now();

  user.passwordResetCode = undefined;
  user.passwordResetCodeVerified = undefined;
  user.passwordResetCodeExpiresAt = undefined;

  await user.save();

  // Generate a new token for the user
  const token = await createToken({ id: user._id });

  res.status(200).json({
    status: 'Success',
    message: 'Password has been reset successfully',
    token,
  })
}


module.exports = {
  signup,
  login,
  protect,
  allowedTo,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
}