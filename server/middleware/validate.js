function validate(req, res, next) {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Please check the submitted information.',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg }))
    });
  }
  next();
}

module.exports = validate;
