const express = require('express')
require('dotenv').config()

const morgan = require('morgan')
require('express-async-errors')
const dbConnection = require('./config/database')
const ApiError = require('./utils/apiError')
const globalErrorHandler = require('./middlewares/errorHandler')
// Routes
const categoryRoute = require('./routes/categoryRoutes')
const subCategoryRoute = require('./routes/subCategoryRoutes')
const brandRoute = require('./routes/brandRoutes')
const productRoute = require('./routes/productRoutes')
const userRoute = require('./routes/userRoutes')
const authRoute = require('./routes/authRoutes')
const reviewRoute = require('./routes/reviewRoutes')
const wishlistRoute = require('./routes/wishlistRoutes')
const addressRoute = require('./routes/addressRoutes')


const app = express()

// *** DATABASE CONNECTION
dbConnection()


// *** MIDDLEWARES
app.use(express.static('uploads'))
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  console.log(`Mode: ${process.env.NODE_ENV}`)
}
app.use(express.json())

app.use('/api/v1/categories', categoryRoute)
app.use('/api/v1/subcategories', subCategoryRoute)
app.use('/api/v1/brands', brandRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/wishlist', wishlistRoute)
app.use('/api/v1/address', addressRoute)

// *** WRONG ROUTE
app.all('*', (req, res, next) => {
  next(new ApiError('Route not available. Please check the URL.', 400))
})

// *** GLOBAL ERROR HANDLER MIDDLEWARE FOR EXPRESS
app.use(globalErrorHandler)


const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
})


// *** HANDLE REJECTION OUTSIDE EXPRESS
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection : ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`Closing the Server...`);
    process.exit(1)
  })
})