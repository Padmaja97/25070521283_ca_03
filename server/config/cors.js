function createCorsOptions(clientUrl) {
  const configuredOrigins = (clientUrl || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = new Set(configuredOrigins);

  if (process.env.NODE_ENV !== 'production' && configuredOrigins.includes('http://localhost:5173')) {
    allowedOrigins.add('http://127.0.0.1:5173');
  }

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error('This origin is not allowed by the Flex Gym CORS configuration.'));
    }
  };
}

module.exports = createCorsOptions;
