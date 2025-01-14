const mongoose = require('mongoose')

const { Schema, model } = mongoose

const orderSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  cartItems: [{
    product: {
      type: Schema.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
    price: Number,
    color: String
  }],
  taxPrice: {
    type: Number,
    default: 0
  },
  shippingPrice: {
    type: Number,
    default: 0
  },
  shippingAddress: {
    details: String,
    phone: String,
    city: String,
    postalCode: String
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    required: [true, 'Payment method is required'],
    default: 'cash'
  },
  totalOrderPrice: {
    type: Number,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  deliveredAt: Date,


}, { timestamps: true })
orderSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name profileImage email phone'
  }).populate({
    path: 'cartItems.product',
    select: 'title imageCover'
  })
})


const Order = model('Order', orderSchema)

module.exports = Order