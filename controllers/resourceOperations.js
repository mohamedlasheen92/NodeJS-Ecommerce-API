const ApiError = require("../utils/apiError");
const DataRetriever = require("../utils/getDataHelper");

const getAll = (Model, modelName) => async (req, res, next) => {
  let filters = {}
  if (req.filterObj) {
    filters = req.filterObj
  }
  // *** BUILD QUERY
  const documentsCount = await Model.countDocuments();
  const query = new DataRetriever(Model.find(filters), req.query)
    .paginate(documentsCount)
    .filter()
    .sort()
    .limitFields()
    .search(modelName);

  // *** EXECUTE QUERY
  const documents = await query.mongooseQuery;

  res.status(200).json({
    count: documents.length,
    paginationResult: query.paginationResult,
    data: documents,
  });
};

const getOne = (Model) => async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findById(id);

  if (!document) return next(new ApiError(`No document with Id ${id}`, 404));

  res.status(200).json(document);
};

const createOne = (Model) => async (req, res, next) => {
  const newDocument = await Model.create(req.body);
  res.status(201).json({ data: newDocument });

};

const updateOne = (Model) => async (req, res, next) => {
  const { id } = req.params;

  const document = await Model.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );
  if (!document)
    return next(new ApiError(`No document with Id ${id}`, 404));

  res.status(200).json({ data: document });

};

const deleteOne = (Model) => async (req, res, next) => {
  const { id } = req.params;

  const document = await Model.findByIdAndDelete(id);
  if (!document)
    return next(new ApiError(`No document with Id ${id}`, 404));

  res.status(204).send();
};




module.exports = {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};
