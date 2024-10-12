const mongoose = require('mongoose')

const { Schema, model } = mongoose

const subCategorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: [true, 'Error : Duplicate subCategory Name! can\'t create new subCategory'],
    minlength: [3, 'The Minimum length of subCategory name is 3'],
    maxlength: [30, 'The Maximum length of subCategory name is 30'],
  },
  slug: {
    type: String,
    lowercase: true,
    unique: [true, 'subCategory Name Slugn must be Unique']
  },
  parentCategory: {
    type: Schema.ObjectId,
    ref: 'Category',
    required: [true, 'SubCategory must belong to parent category']
  }

}, { timestamps: true })

const SubCategory = model('SubCategory', subCategorySchema)

module.exports = SubCategory