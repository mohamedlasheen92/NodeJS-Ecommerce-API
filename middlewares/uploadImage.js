// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');

const ApiError = require("../utils/apiError")

const setUploadMiddleware = () => {
  const storage = multer.memoryStorage()
  const fileFilter = function (req, file, cb) {

    if (file.mimetype.startsWith('image')) {
      cb(null, true)
    } else {
      cb(new ApiError('Only image files are allowed!', 400), false)
    }

  }
  const upload = multer({ storage, fileFilter })

  // Temporarily saves image in memory for processing before storing it in the database
  return upload
}
const uploadSingleImage = (fieldName) => setUploadMiddleware().single(fieldName)
const uploadMultipleImages = (arrOfObjects) => setUploadMiddleware().fields(arrOfObjects)

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
}