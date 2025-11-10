const messageService = require('../services/message.service');
const attachmentService = require('../services/attachment.service');
const s3Service = require('../../../core/services/s3.service');
const { sendSuccessResponse } = require('../../../core/utils/response');
const ErrorHandler = require('../../../core/errors/ErrorHandler');
const { logger } = require('../../../core/utils/logger');
const { BadRequestError } = require('../../../core/errors/AppError');

class MessageController {
  /**
   * Send a message
   */
  async sendMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;
      const { content, replyTo, messageType = 'text' } = req.body;
      const files = req.files || [];

      // Normalize content (empty string to null/undefined)
      const normalizedContent = (content && typeof content === 'string' && content.trim()) ? content.trim() : null;

      // Log for debugging
      logger.info(`[MessageController] Sending message - conversationId: ${conversationId}, content length: ${normalizedContent?.length || 0}, files count: ${files.length}`);

      // Handle file uploads
      const attachments = [];
      const uploadErrors = [];
      
      if (files.length > 0) {
        for (const file of files) {
          try {
            const attachment = await attachmentService.uploadAttachment(
              file.buffer,
              userId,
              file.originalname,
              file.mimetype
            );
            attachments.push(attachment);
            logger.info(`[MessageController] Attachment uploaded successfully: ${attachment.filename}`);
          } catch (error) {
            logger.error(`Failed to upload attachment "${file.originalname}":`, error);
            uploadErrors.push({
              filename: file.originalname,
              error: error.message || 'Upload failed',
            });
          }
        }
        
        // If we have files but all uploads failed, return error immediately
        if (attachments.length === 0 && uploadErrors.length > 0) {
          const errorMessage = uploadErrors.length === 1 
            ? uploadErrors[0].error
            : `Failed to upload ${uploadErrors.length} file(s): ${uploadErrors.map(e => e.filename).join(', ')}`;
          throw new BadRequestError(errorMessage);
        }
        
        // If some files failed, log warning but continue with successful uploads
        if (uploadErrors.length > 0) {
          logger.warn(`[MessageController] Some attachments failed to upload: ${uploadErrors.length} failed, ${attachments.length} succeeded`);
        }
      }
      
      logger.info(`[MessageController] Final attachments count: ${attachments.length}`);

      const messageData = {
        content: normalizedContent,
        replyTo,
        attachments,
        messageType: attachments.length > 0 && !normalizedContent ? attachments[0].type : messageType,
      };

      const message = await messageService.sendMessage(conversationId, userId, messageData);
      
      sendSuccessResponse(res, message, 'Message sent successfully', 201);
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Get messages for conversation
   */
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;
      const { page = 1, limit = 50, before } = req.query;

      const result = await messageService.getMessages(conversationId, userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        before: before ? new Date(before) : null,
      });
      
      sendSuccessResponse(res, result, 'Messages retrieved successfully');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Edit a message
   */
  async editMessage(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { content } = req.body;

      const message = await messageService.editMessage(id, userId, content);
      
      sendSuccessResponse(res, message, 'Message edited successfully');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      const { deleteFor = 'everyone' } = req.body; // 'me' or 'everyone'
      const userId = req.user._id;

      const message = await messageService.deleteMessage(id, userId, deleteFor);
      
      sendSuccessResponse(res, message, `Message deleted ${deleteFor === 'me' ? 'for you' : 'for everyone'} successfully`);
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Add reaction to message
   */
  async addReaction(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { emoji } = req.body;

      const result = await messageService.addReaction(id, userId, emoji);
      
      sendSuccessResponse(
        res,
        result,
        result.removed ? 'Reaction removed successfully' : 'Reaction added successfully'
      );
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const messageRead = await messageService.markMessageAsRead(id, userId);
      
      sendSuccessResponse(res, messageRead, 'Message marked as read');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Mark all messages as read
   */
  async markAllMessagesAsRead(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;

      const result = await messageService.markAllMessagesAsRead(conversationId, userId);
      
      sendSuccessResponse(res, result, 'All messages marked as read');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Pin/unpin a message
   */
  async pinMessage(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { pin = true } = req.body;

      const message = await messageService.pinMessage(id, userId, pin);
      
      sendSuccessResponse(res, message, `Message ${pin ? 'pinned' : 'unpinned'} successfully`);
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Get pinned messages
   */
  async getPinnedMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;

      const messages = await messageService.getPinnedMessages(conversationId, userId);
      
      sendSuccessResponse(res, messages, 'Pinned messages retrieved successfully');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }

  /**
   * Search messages
   */
  async searchMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;
      const { q: query, page = 1, limit = 20 } = req.query;

      if (!query || query.trim().length === 0) {
        return sendSuccessResponse(res, { messages: [], total: 0 }, 'No search query provided');
      }

      const result = await messageService.searchMessages(conversationId, userId, query, {
        page: parseInt(page),
        limit: parseInt(limit),
      });
      
      sendSuccessResponse(res, result, 'Search completed successfully');
    } catch (error) {
      ErrorHandler.handle(error, req, res, null);
    }
  }
}

module.exports = new MessageController();

