/* eslint-disable import/no-extraneous-dependencies */
const express = require('express')
require('dotenv').config()

const morgan = require('morgan')

const cors = require('cors')
const compression = require('compression')

require('express-async-errors')
const dbConnection = require('./config/database')
const ApiError = require('./utils/apiError')
const globalErrorHandler = require('./middlewares/errorHandler')

// Routes
const mountRoutes = require('./routes')

const app = express()

// *** CORS [Enables other domains to access the application]
app.use(cors())
app.options('*', cors())

// *** COMPRESSION [Saves bandwidth by compressing the response]
app.use(compression())

// *** DATABASE CONNECTION
dbConnection()


// *** MIDDLEWARES
app.use(express.static('uploads'))
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  console.log(`Mode: ${process.env.NODE_ENV}`)
}
app.use(express.json())

// *** ROUTES
mountRoutes(app)

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