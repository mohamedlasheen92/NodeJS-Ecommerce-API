const express = require('express')
const app = express()
require('dotenv').config()
const dbConnection = require('./config/database')
const morgan = require('morgan')
const categoryRouter = require('./routes/category')

// *** DATABASE CONNECTION
dbConnection()

// *** MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  console.log(`Mode: ${process.env.NODE_ENV}`)
}
app.use(express.json())

app.use('/api/v1/categories', categoryRouter)



const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
})