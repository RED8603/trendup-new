const { logger } = require('./logger');

class ResponseHandler {
  static success(res, data = null, message = 'Success', statusCode = 200, meta = {}) {
    const response = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };

    logger.info({
      statusCode,
      message,
      url: res.req?.originalUrl,
      method: res.req?.method
    });

    return res.status(statusCode).json(response);
  }

  static created(res, data = null, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static paginated(res, data, pagination, message = 'Data retrieved successfully') {
    return this.success(res, data, message, 200, { pagination });
  }
}

// Convenience functions
const sendSuccessResponse = (res, data, message, statusCode, meta) => 
  ResponseHandler.success(res, data, message, statusCode, meta);

const sendCreatedResponse = (res, data, message) => 
  ResponseHandler.created(res, data, message);

const sendPaginatedResponse = (res, data, pagination, message) => 
  ResponseHandler.paginated(res, data, pagination, message);

module.exports = {
  ResponseHandler,
  sendSuccessResponse,
  sendCreatedResponse,
  sendPaginatedResponse
};
