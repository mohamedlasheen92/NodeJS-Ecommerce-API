const { validationResult } = require("express-validator");

const validatorMiddleware = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(404).json({ errors: result.array() });
  }

  next();
}


module.exports = validatorMiddleware