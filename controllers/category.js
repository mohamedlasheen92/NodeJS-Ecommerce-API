const slugify = require("slugify")
const Category = require("../models/Category")
const ApiError = require("../utils/apiError")

const getCategories = async (req, res, next) => {
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  const skip = (page - 1) * limit

  const categories = await Category.find({}).skip(skip).limit(limit)
  res.status(200).json({ count: categories.length, data: categories })


}
const getCategory = async (req, res, next) => {

  const { id } = req.params
  const category = await Category.findById(id)
  if (!category)
    return next(new ApiError(`No Category with Id ${id}`, 404))

  res.status(200).json(category)

}

const createCategory = async (req, res, next) => {
  const { name } = req.body


  const newCategory = await Category.create({ name, slug: slugify(name) })
  res.status(201).json(newCategory)


}

const updateCategory = async (req, res, next) => {

  const { id } = req.params
  const { name } = req.body
  const category = await Category.findOneAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true })
  if (!category)
    return next(new ApiError(`No Category with Id ${id}`, 404))

  res.status(200).json(category)



}

const deleteCategory = async (req, res, next) => {

  const { id } = req.params
  const category = await Category.findByIdAndDelete(id)
  if (!category)
    return next(new ApiError(`No Category with Id ${id}`, 404))

  res.status(204).send()


}


module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
}