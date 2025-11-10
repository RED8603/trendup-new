const Joi = require('joi');

const conversationValidators = {
  createDirectConversation: {
    body: Joi.object({
      otherUserId: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid user ID format',
          'string.length': 'Invalid user ID format',
          'any.required': 'Other user ID is required'
        })
    })
  },

  createGroupConversation: {
    body: Joi.object({
      name: Joi.string().trim().min(1).max(100).required()
        .messages({
          'string.min': 'Group name must be at least 1 character',
          'string.max': 'Group name cannot exceed 100 characters',
          'any.required': 'Group name is required'
        }),
      description: Joi.string().trim().max(500).allow(null, '')
        .messages({
          'string.max': 'Description cannot exceed 500 characters'
        }),
      avatar: Joi.string().uri().allow(null, '')
        .messages({
          'string.uri': 'Avatar must be a valid URL'
        }),
      participantIds: Joi.array().items(
        Joi.string().hex().length(24)
      ).optional()
        .messages({
          'array.base': 'Participant IDs must be an array',
          'string.hex': 'Invalid participant ID format',
          'string.length': 'Invalid participant ID format'
        })
    })
  },

  getConversation: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format',
          'any.required': 'Conversation ID is required'
        })
    })
  },

  getUserConversations: {
    query: Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(100).optional(),
      archived: Joi.boolean().optional()
    })
  },

  addParticipants: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    }),
    body: Joi.object({
      participantIds: Joi.array().items(
        Joi.string().hex().length(24)
      ).min(1).required()
        .messages({
          'array.min': 'At least one participant ID is required',
          'array.base': 'Participant IDs must be an array',
          'any.required': 'Participant IDs are required'
        })
    })
  },

  removeParticipant: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    }),
    body: Joi.object({
      participantId: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid participant ID format',
          'string.length': 'Invalid participant ID format',
          'any.required': 'Participant ID is required'
        })
    })
  },

  updateGroupConversation: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    }),
    body: Joi.object({
      name: Joi.string().trim().min(1).max(100).optional(),
      description: Joi.string().trim().max(500).allow(null, '').optional(),
      avatar: Joi.string().uri().allow(null, '').optional()
    })
  },

  archiveConversation: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    }),
    body: Joi.object({
      archive: Joi.boolean().optional()
    })
  },

  muteConversation: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required()
        .messages({
          'string.hex': 'Invalid conversation ID format',
          'string.length': 'Invalid conversation ID format'
        })
    }),
    body: Joi.object({
      mute: Joi.boolean().optional(),
      muteUntil: Joi.date().iso().optional()
        .messages({
          'date.format': 'Mute until must be a valid ISO 8601 date'
        })
    })
  }
};

module.exports = conversationValidators;

