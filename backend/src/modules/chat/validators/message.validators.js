const Joi = require('joi');

const messageValidators = {
  sendMessage: {
    params: Joi.object({
      conversationId: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    }),
    body: Joi.object({
      content: Joi.string().trim().max(10000).allow('').optional()
        .messages({
          'string.max': 'Message content cannot exceed 10000 characters'
        }),
      replyTo: Joi.string().hex().length(24).allow(null, '').optional()
        .messages({
          'string.hex': 'Invalid reply message ID format',
          'string.length': 'Invalid reply message ID format'
        }),
      messageType: Joi.string().valid('text', 'image', 'video', 'audio', 'file', 'system').optional()
        .messages({
          'any.only': 'Invalid message type'
        })
    })
  },

  getMessages: {
    params: Joi.object({
      conversationId: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    }),
    query: Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(100).optional(),
      before: Joi.date().iso().optional()
        .messages({
          'date.format': 'Before must be a valid ISO 8601 date'
        })
    })
  },

  editMessage: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid message ID format',
          'string.length': 'Invalid message ID format'
        })
    }),
    body: Joi.object({
      content: Joi.string().trim().min(1).max(10000).required()
        .messages({
          'string.min': 'Message content cannot be empty',
          'string.max': 'Message content cannot exceed 10000 characters',
          'any.required': 'Message content is required'
        })
    })
  },

  deleteMessage: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid message ID format',
          'string.length': 'Invalid message ID format'
        })
    }),
    body: Joi.object({
      deleteFor: Joi.string().valid('me', 'everyone').optional()
        .messages({
          'any.only': 'deleteFor must be either "me" or "everyone"'
        })
    })
  },

  addReaction: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid message ID format',
          'string.length': 'Invalid message ID format'
        })
    }),
    body: Joi.object({
      emoji: Joi.string().trim().min(1).max(10).required()
        .messages({
          'string.min': 'Emoji is required',
          'string.max': 'Emoji cannot exceed 10 characters',
          'any.required': 'Emoji is required'
        })
    })
  },

  markMessageAsRead: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid message ID format',
          'string.length': 'Invalid message ID format'
        })
    })
  },

  markAllMessagesAsRead: {
    params: Joi.object({
      conversationId: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    })
  },

  pinMessage: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid message ID format',
          'string.length': 'Invalid message ID format'
        })
    }),
    body: Joi.object({
      pin: Joi.boolean().optional()
    })
  },

  getPinnedMessages: {
    params: Joi.object({
      conversationId: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    })
  },

  searchMessages: {
    params: Joi.object({
      conversationId: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    }),
    query: Joi.object({
      q: Joi.string().trim().min(1).max(100).required()
        .messages({
          'string.min': 'Search query is required',
          'string.max': 'Search query cannot exceed 100 characters',
          'any.required': 'Search query is required'
        }),
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(50).optional()
    })
  }
};

module.exports = messageValidators;

