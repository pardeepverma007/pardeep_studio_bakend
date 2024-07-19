

const successResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json({
    status: true,
    data: data,
    message: message ? message : undefined,
  });
};

const errorResponse = (res, statusCode, message, error = null) => {
  return res.status(statusCode).json({
    status: false,
    data: [],
    message: message,
    error: error ? error.message : error,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
