const mongoose = require('mongoose')

const { Schema, model } = mongoose

const brandSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: [true, 'Error : Duplicate brand Name! can\'t create new brand'],
    minlength: [3, 'The Minimum length of brand name is 3'],
    maxlength: [30, 'The Maximum length of brand name is 30'],
  },
  slug: {
    type: String,
    lowercase: true,
    unique: [true, 'brand Name Slugn must be Unique']
  },
  image: {
    type: String
  }

}, { timestamps: true })

const setImageURL = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`
    doc.image = imageURL
  }
}
brandSchema.post('init', (doc) => {
  setImageURL(doc)
})
brandSchema.post('save', (doc) => {
  setImageURL(doc)
})


const Brand = model('Brand', brandSchema)

module.exports = Brand