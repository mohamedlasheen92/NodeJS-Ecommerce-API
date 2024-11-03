
class DataRetriever {
  constructor(mongooseQuery, queryParams) {
    this.mongooseQuery = mongooseQuery
    this.queryParams = queryParams
  }

  filter() {
    let filterObject = {}

    // *** FILTERATION
    const excludedFields = ['page', 'limit', 'skip', 'sort', 'fields', 'keyword']

    const filterStr = JSON.stringify(this.queryParams).replace(/(lt|lte|gt|gte|eq)/g, (operator) => `$${operator}`);
    filterObject = JSON.parse(filterStr)

    excludedFields.forEach(field => delete filterObject[field])

    this.mongooseQuery = this.mongooseQuery.find(filterObject)

    return this
  }

  sort() {
    if (this.queryParams.sort) {
      const sortStr = this.queryParams.sort.split(',').join(' ')
      this.mongooseQuery = this.mongooseQuery.sort(sortStr)
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
    }

    return this
  }

  limitFields() {
    if (this.queryParams.fields) {
      const targetFieldsStr = this.queryParams.fields.split(',').join(' ')
      this.mongooseQuery = this.mongooseQuery.select(targetFieldsStr)
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v')
    }

    return this
  }

  search(modelName) {
    if (this.queryParams.keyword) {
      let searchObj = {}
      if (modelName === 'Product') {

        searchObj.$or = [
          { title: { $regex: this.queryParams.keyword, $options: 'i' } },
          { description: { $regex: this.queryParams.keyword, $options: 'i' } },
        ]
        this.mongooseQuery = this.mongooseQuery.find(searchObj)
      } else {
        searchObj = { name: { $regex: this.queryParams.keyword, $options: 'i' } }
      }

      this.mongooseQuery = this.mongooseQuery.find(searchObj)
    }

    return this
  }


  paginate(documentsCount) {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const lastIndexOfPage = page * limit

    const paginationObject = {}  //Next,Previous,CurrentPage,PagesCount

    paginationObject.currentPage = page
    paginationObject.pagesCount = Math.ceil(documentsCount / limit)

    if (documentsCount > lastIndexOfPage)
      paginationObject.next = page + 1

    if (skip > 0)
      paginationObject.prev = page - 1

    this.paginationResult = paginationObject
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)

    return this
  }
}

module.exports = DataRetriever