const conversationService = require('../services/conversation.service');
const { sendSuccessResponse } = require('../../../core/utils/response');
const ErrorHandler = require('../../../core/errors/ErrorHandler');

class ConversationController {
  /**
   * Create direct conversation
   */
  async createDirectConversation(req, res) {
    try {
      const userId = req.user._id;
      const { otherUserId } = req.body;

      const conversation = await conversationService.createDirectConversation(userId, otherUserId);
      
      sendSuccessResponse(res, conversation, 'Direct conversation created successfully', 201);
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Create group conversation
   */
  async createGroupConversation(req, res) {
    try {
      const userId = req.user._id;
      const groupData = req.body;

      const conversation = await conversationService.createGroupConversation(userId, groupData);
      
      sendSuccessResponse(res, conversation, 'Group conversation created successfully', 201);
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Get conversation by ID
   */
  async getConversationById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const conversation = await conversationService.getConversationById(id, userId);
      
      sendSuccessResponse(res, conversation, 'Conversation retrieved successfully');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Get user conversations
   */
  async getUserConversations(req, res) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 50, archived } = req.query;

      // Convert archived string to boolean (defaults to false if not provided)
      const isArchived = archived === 'true' || archived === true;

      const result = await conversationService.getUserConversations(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        archived: isArchived,
      });
      
      sendSuccessResponse(res, result, 'Conversations retrieved successfully');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Add participants to group
   */
  async addParticipants(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { participantIds } = req.body;

      const conversation = await conversationService.addParticipants(id, userId, participantIds);
      
      sendSuccessResponse(res, conversation, 'Participants added successfully');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Remove participant from group
   */
  async removeParticipant(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { participantId } = req.body;

      const conversation = await conversationService.removeParticipant(id, userId, participantId);
      
      sendSuccessResponse(res, conversation, 'Participant removed successfully');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Update group conversation
   */
  async updateGroupConversation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const updates = req.body;

      const conversation = await conversationService.updateGroupConversation(id, userId, updates);
      
      sendSuccessResponse(res, conversation, 'Group conversation updated successfully');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Archive/unarchive conversation
   */
  async archiveConversation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { archive = true } = req.body;

      const conversation = await conversationService.archiveConversation(id, userId, archive);
      
      sendSuccessResponse(res, conversation, `Conversation ${archive ? 'archived' : 'unarchived'} successfully`);
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Mute/unmute conversation
   */
  async muteConversation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { mute = true, muteUntil = null } = req.body;

      const participant = await conversationService.muteConversation(
        id,
        userId,
        mute,
        muteUntil ? new Date(muteUntil) : null
      );
      
      sendSuccessResponse(res, participant, `Conversation ${mute ? 'muted' : 'unmuted'} successfully`);
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }
}

module.exports = new ConversationController();

