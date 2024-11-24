const ApiError = require("../utils/apiError")

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}
const sendErrorForProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
}

const handleExpiredToken = () => new ApiError('Expired token, please login again.', 401)
const handlejwtError = () => new ApiError('Invalid token, please login again.', 401)

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development')
    sendErrorForDev(err, res)
  else {
    if (err.name === 'TokenExpiredError') err = handleExpiredToken()
    if (err.name === 'JsonWebTokenError') err = handlejwtError()
    sendErrorForProd(err, res)
  }

}


module.exports = globalErrorHandler