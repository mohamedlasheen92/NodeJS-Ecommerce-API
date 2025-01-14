const mongoose = require('mongoose')

const { Schema, model } = mongoose

const cartSchema = new Schema({
  cartItems: [{
    product: {
      type: Schema.ObjectId,
      ref: 'Product',
    },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    color: { type: String }
  }],
  totalCartPrice: { type: Number, default: 0 },
  totalCartPriceAfterDiscount: { type: Number, default: undefined },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Cart must belong to a user']
  }

}, { timestamps: true })




const Cart = model('Cart', cartSchema)

module.exports = Cart