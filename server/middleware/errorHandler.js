function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  console.error(error);
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with these details already exists.' });
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }
  res.status(error.status || 500).json({
    message: error.status ? error.message : 'An unexpected server error occurred.'
  });
}

module.exports = { notFound, errorHandler };
