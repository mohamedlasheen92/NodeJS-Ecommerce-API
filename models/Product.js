const mongoose = require('mongoose')

const { Schema, model } = mongoose

const productSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    unique: [true, 'Error : Duplicate product title!'],
    minlength: [3, 'Product title must be at least 3 characters long'],
    maxlength: [100, 'The Maximum length of product title is 100'],
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [20, 'Product description must be at least 20 characters long'],
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
  },
  sold: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    trime: true,
    max: [200000, 'The maximum price is 200,000']
  },
  priceAfterDiscount: {
    type: Number,
  },
  colors: [String],
  imageCover: {
    type: String,
    required: [true, 'Product cover image is required'],
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required'],
  },
  subCategories: [
    {
      type: Schema.ObjectId,
      ref: 'SubCategory'
    }
  ],
  brand: {
    type: Schema.ObjectId,
    ref: 'Brand'
  },
  ratingsAverage: {
    type: Number,
    min: [1, 'The Minimum of product ratings average is 1.0'],
    max: [5, 'The Maximum of product ratings average is 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  }

}, { timestamps: true })


const Product = model('Product', productSchema)
module.exports = Product