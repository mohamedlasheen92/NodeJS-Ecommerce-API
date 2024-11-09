const mongoose = require('mongoose')

const { Schema, model } = mongoose

const categorySchema = new Schema({
  name: {
    type: String,
    unique: [true, 'Error : Duplicate Category Name! can\'t create new Category'],
    minlength: [3, 'The Minimum length of category name is 3'],
    maxlength: [30, 'The Maximum length of category name is 30'],
  },
  slug: {
    type: String,
    lowercase: true,
    unique: [true, 'Category Name Slugn must be Unique']
  },
  image: {
    type: String
  }
}, { timestamps: true })

const setImageURL = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`
    doc.image = imageURL
  }
}
categorySchema.post('init', (doc) => {
  setImageURL(doc)
})
categorySchema.post('save', (doc) => {
  setImageURL(doc)
})


const Category = model('Category', categorySchema)

module.exports = Category