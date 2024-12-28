/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose')
const Product = require('./Product')

const { Schema, model } = mongoose

const reviewSchema = new Schema({
  title: {
    type: String,
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    required: [true, 'Rating is required'],
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Review must be associated with a product'],
  }

}, { timestamps: true })

reviewSchema.statics.calcReviewStatistics = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", ratingsAverage: { $avg: "$rating" }, ratingsQuantity: { $sum: 1 } } },
  ])

  console.log(result);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].ratingsAverage,
      ratingsQuantity: result[0].ratingsQuantity,
    })
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    })
  }
}

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name'
  })
})

reviewSchema.post('save', async function (doc) {
  this.constructor.calcReviewStatistics(doc.product)
})


reviewSchema.post('findOneAndDelete', async (doc) => {
  doc.constructor.calcReviewStatistics(doc.product)
})



const Review = model('Review', reviewSchema)
module.exports = Review 