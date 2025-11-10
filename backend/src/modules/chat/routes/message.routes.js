const express = require('express');
const router = express.Router();
const { authenticate } = require('../../auth/middleware/auth.middleware');
const { multipleUpload } = require('../../../core/middleware/upload.middleware');
const { validate } = require('../../../core/utils/validator');
const messageValidators = require('../validators/message.validators');
const messageController = require('../controllers/message.controller');

// Apply auth middleware to all routes
router.use(authenticate);

// Message CRUD
router.post('/:conversationId/messages', multipleUpload('attachments', 5), validate(messageValidators.sendMessage), messageController.sendMessage.bind(messageController));
router.get('/:conversationId/messages', validate(messageValidators.getMessages), messageController.getMessages.bind(messageController));

// Message actions
router.patch('/messages/:id', validate(messageValidators.editMessage), messageController.editMessage.bind(messageController));
router.delete('/messages/:id', validate(messageValidators.deleteMessage), messageController.deleteMessage.bind(messageController));

// Reactions
router.post('/messages/:id/reactions', validate(messageValidators.addReaction), messageController.addReaction.bind(messageController));

// Read receipts
router.post('/messages/:id/read', validate(messageValidators.markMessageAsRead), messageController.markMessageAsRead.bind(messageController));
router.post('/:conversationId/messages/read-all', validate(messageValidators.markAllMessagesAsRead), messageController.markAllMessagesAsRead.bind(messageController));

// Pinned messages
router.post('/messages/:id/pin', validate(messageValidators.pinMessage), messageController.pinMessage.bind(messageController));
router.get('/:conversationId/messages/pinned', validate(messageValidators.getPinnedMessages), messageController.getPinnedMessages.bind(messageController));

// Search
router.get('/:conversationId/messages/search', validate(messageValidators.searchMessages), messageController.searchMessages.bind(messageController));

module.exports = router;

