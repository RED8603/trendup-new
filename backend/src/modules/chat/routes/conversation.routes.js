const express = require('express');
const router = express.Router();
const { authenticate } = require('../../auth/middleware/auth.middleware');
const { validate } = require('../../../core/utils/validator');
const conversationValidators = require('../validators/conversation.validators');
const conversationController = require('../controllers/conversation.controller');

// Apply auth middleware to all routes
router.use(authenticate);

// Create conversations
router.post('/direct', validate(conversationValidators.createDirectConversation), conversationController.createDirectConversation.bind(conversationController));
router.post('/group', validate(conversationValidators.createGroupConversation), conversationController.createGroupConversation.bind(conversationController));

// Get conversations
router.get('/', validate(conversationValidators.getUserConversations), conversationController.getUserConversations.bind(conversationController));
router.get('/:id', validate(conversationValidators.getConversation), conversationController.getConversationById.bind(conversationController));

// Group conversation management
router.post('/:id/participants', validate(conversationValidators.addParticipants), conversationController.addParticipants.bind(conversationController));
router.delete('/:id/participants', validate(conversationValidators.removeParticipant), conversationController.removeParticipant.bind(conversationController));
router.patch('/:id', validate(conversationValidators.updateGroupConversation), conversationController.updateGroupConversation.bind(conversationController));

// Conversation actions
router.post('/:id/archive', validate(conversationValidators.archiveConversation), conversationController.archiveConversation.bind(conversationController));
router.post('/:id/mute', validate(conversationValidators.muteConversation), conversationController.muteConversation.bind(conversationController));

module.exports = router;

