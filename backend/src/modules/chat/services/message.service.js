const { Message, MessageRead, MessageReaction, MessageDeleted, Participant, Conversation } = require('../models');
const { User } = require('../../auth/models');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../../../core/errors/AppError');
const { logger } = require('../../../core/utils/logger');
const encryptionService = require('./encryption.service');
const chatSocketService = require('./chat.socket.service');
const notificationService = require('../../../core/services/notification.service.simple');
const mongoose = require('mongoose');

class MessageService {
  /**
   * Helper: Decrypt message content
   * @param {Object} message - Message object with encryptedContent
   * @param {Buffer} conversationKey - Conversation encryption key
   * @returns {String} - Decrypted content
   */
  decryptMessageContent(message, conversationKey) {
    try {
      if (!message.encryptedContent) {
        return message.content || '';
      }

      const encryptedData = JSON.parse(message.encryptedContent);
      return encryptionService.decryptMessage(encryptedData, conversationKey);
    } catch (error) {
      logger.error('Decrypt message content error:', error);
      // Return empty string if decryption fails
      return '';
    }
  }

  /**
   * Send a message
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - Sender ID
   * @param {Object} messageData - { content, replyTo, attachments, messageType }
   * @returns {Object} - Created message
   */
  async sendMessage(conversationId, userId, messageData) {
    try {
      let { content, replyTo, attachments = [], messageType = 'text' } = messageData;

      // Normalize content (empty string to null) - handle both string and already normalized
      const normalizedContent = (content && typeof content === 'string' && content.trim()) ? content.trim() : null;
      
      // Validate participant
      const participant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }
      
      // Validate content or attachments
      if (!normalizedContent && (!attachments || attachments.length === 0)) {
        logger.error(`[MessageService] Validation failed - content: ${normalizedContent}, attachments: ${attachments?.length || 0}`);
        throw new BadRequestError('Message must have content or attachments');
      }

      // Validate replyTo if provided
      if (replyTo) {
        const replyToMessage = await Message.findOne({
          _id: replyTo,
          conversationId,
          deletedAt: null,
        });

        if (!replyToMessage) {
          throw new NotFoundError('Message to reply to');
        }
      }

      // Encrypt message content
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new NotFoundError('Conversation');
      }

      // For E2E encryption, content is already encrypted on client side
      // But we'll encrypt it again server-side for storage
      // In production, you might want to skip server-side encryption if client already encrypted
      const conversationKey = Buffer.from(conversation.conversationKey, 'base64');
      // Allow empty string for attachment-only messages
      const contentToEncrypt = normalizedContent || '';
      const encryptedData = encryptionService.encryptMessage(contentToEncrypt, conversationKey);
      const contentHash = encryptionService.hashContent(contentToEncrypt);

      // Create message
      const message = new Message({
        conversationId,
        senderId: userId,
        encryptedContent: JSON.stringify(encryptedData), // Store encrypted data as JSON string
        contentHash,
        messageType,
        replyTo: replyTo || null,
        attachments: attachments.map(att => ({
          type: att.type,
          url: att.url,
          filename: att.filename,
          size: att.size,
          mimeType: att.mimeType,
          thumbnail: att.thumbnail || null,
        })),
      });

      await message.save();

      // Update conversation
      conversation.lastMessage = message._id;
      conversation.lastMessageAt = new Date();
      conversation.messageCount += 1;
      await conversation.save();

      // Increment unread count for all participants except sender
      await Participant.updateMany(
        {
          conversationId,
          userId: { $ne: userId },
          isActive: true,
        },
        { $inc: { unreadCount: 1 } }
      );

      // Populate message
      const populatedMessage = await Message.findById(message._id)
        .populate('senderId', 'name username avatar')
        .populate('replyTo', 'senderId encryptedContent')
        .populate('replyTo.senderId', 'name username avatar');

      // Decrypt message content for response
      const msgObj = populatedMessage.toObject();
      const decryptedContent = this.decryptMessageContent(msgObj, conversationKey);
      
      // Add decrypted content to response
      const responseMessage = {
        ...msgObj,
        content: decryptedContent,
        // Ensure attachments are included (they should already be in msgObj)
        attachments: msgObj.attachments || [],
      };

      // Decrypt replyTo message if exists
      if (responseMessage.replyTo && responseMessage.replyTo.encryptedContent) {
        try {
          const replyDecrypted = this.decryptMessageContent(responseMessage.replyTo, conversationKey);
          responseMessage.replyTo.content = replyDecrypted;
        } catch (error) {
          logger.error('Failed to decrypt reply message:', error);
        }
      }

      logger.info(`[MessageService] ========== MESSAGE SENT ==========`);
      logger.info(`[MessageService] Message ID: ${message._id}`);
      logger.info(`[MessageService] Conversation ID: ${conversationId}`);
      logger.info(`[MessageService] Sender ID: ${userId}`);
      logger.info(`[MessageService] Content length: ${decryptedContent.length}`);

      // Emit socket event for real-time delivery (with decrypted content)
      try {
        logger.info(`[MessageService] Emitting socket event...`);
        await chatSocketService.emitMessageSent(conversationId, responseMessage, userId);
        logger.info(`[MessageService] Socket event emitted successfully`);
      } catch (socketError) {
        logger.error('[MessageService] Failed to emit socket event:', socketError);
        logger.error('[MessageService] Socket error details:', {
          message: socketError.message,
          stack: socketError.stack
        });
        // Don't fail the message send if socket fails
      }
      logger.info(`[MessageService] ==================================`);

      // Send notifications to all participants except sender
      try {
        const participants = await Participant.find({
          conversationId,
          userId: { $ne: userId },
          isActive: true,
        }).populate('userId', 'name username avatar');

        const sender = await User.findById(userId).select('name username avatar');

        for (const participant of participants) {
          try {
            const notification = await notificationService.createNotification(
              participant.userId._id.toString(),
              notificationService.notificationTypes.MESSAGE_RECEIVED,
              {
                conversationId: conversationId.toString(),
                messageId: message._id.toString(),
                sender: {
                  userId: sender._id.toString(),
                  name: sender.name,
                  username: sender.username,
                  avatar: sender.avatar,
                },
                messagePreview: decryptedContent.substring(0, 100), // First 100 chars
                messageType: messageType,
              },
              notificationService.priorityLevels.MEDIUM
            );
            await notificationService.sendNotification(participant.userId._id.toString(), notification);
          } catch (notifError) {
            logger.error(`[MessageService] Failed to send notification to ${participant.userId._id}:`, notifError);
            // Continue with other participants
          }
        }
      } catch (notifError) {
        logger.error('[MessageService] Failed to send notifications:', notifError);
        // Don't fail the message send if notifications fail
      }

      return responseMessage;
    } catch (error) {
      logger.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Get messages for a conversation (paginated)
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User ID requesting
   * @param {Object} options - { page, limit, before }
   * @returns {Object} - { messages, total, page, limit }
   */
  async getMessages(conversationId, userId, options = {}) {
    try {
      const { page = 1, limit = 50, before } = options;
      const skip = (page - 1) * limit;

      // Validate participant
      const participant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      // Build query
      const query = {
        conversationId,
        deletedAt: null,
      };

      if (before) {
        query.createdAt = { $lt: new Date(before) };
      }

      // Get messages deleted "for me" by this user
      const deletedForUser = await MessageDeleted.find({
        conversationId,
        userId,
      }).select('messageId');

      const deletedMessageIds = deletedForUser.map(d => d.messageId);

      // Exclude messages deleted "for me" by this user
      if (deletedMessageIds.length > 0) {
        query._id = { $nin: deletedMessageIds };
      }

      // Get messages
      const messages = await Message.find(query)
        .populate('senderId', 'name username avatar')
        .populate('replyTo', 'senderId encryptedContent')
        .populate('replyTo.senderId', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Get total count
      const total = await Message.countDocuments(query);

      // Get read status for each message
      const messageIds = messages.map(m => m._id);
      const readStatuses = await MessageRead.find({
        messageId: { $in: messageIds },
        userId,
      });

      const readMap = new Map();
      readStatuses.forEach(rs => {
        readMap.set(rs.messageId.toString(), rs.readAt);
      });

      // Get reactions for messages
      const reactions = await MessageReaction.find({
        messageId: { $in: messageIds },
      })
        .populate('userId', 'name username avatar')
        .sort({ createdAt: 1 });

      const reactionMap = new Map();
      reactions.forEach(reaction => {
        const msgId = reaction.messageId.toString();
        if (!reactionMap.has(msgId)) {
          reactionMap.set(msgId, []);
        }
        reactionMap.get(msgId).push({
          emoji: reaction.emoji,
          userId: reaction.userId,
          createdAt: reaction.createdAt,
        });
      });

      // Get conversation key for decryption
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new NotFoundError('Conversation');
      }
      const conversationKey = Buffer.from(conversation.conversationKey, 'base64');

      // Format messages and decrypt content
      const formattedMessages = messages.map(message => {
        const msgObj = message.toObject();
        
        // Decrypt message content
        const decryptedContent = this.decryptMessageContent(msgObj, conversationKey);
        
        // Decrypt replyTo message if exists
        let replyToContent = null;
        if (msgObj.replyTo && msgObj.replyTo.encryptedContent) {
          try {
            replyToContent = this.decryptMessageContent(msgObj.replyTo, conversationKey);
          } catch (error) {
            logger.error('Failed to decrypt reply message:', error);
          }
        }

        return {
          ...msgObj,
          content: decryptedContent,
          replyTo: msgObj.replyTo ? {
            ...msgObj.replyTo,
            content: replyToContent || msgObj.replyTo.content || '',
          } : null,
          readAt: readMap.get(msgObj._id.toString()) || null,
          reactions: reactionMap.get(msgObj._id.toString()) || [],
        };
      });

      return {
        messages: formattedMessages.reverse(), // Reverse to show oldest first
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Get messages error:', error);
      throw error;
    }
  }

  /**
   * Edit a message
   * @param {String} messageId - Message ID
   * @param {String} userId - User ID (must be sender)
   * @param {String} newContent - New message content
   * @returns {Object} - Updated message
   */
  async editMessage(messageId, userId, newContent) {
    try {
      if (!newContent || newContent.trim().length === 0) {
        throw new BadRequestError('Message content cannot be empty');
      }

      const message = await Message.findById(messageId);
      if (!message) {
        throw new NotFoundError('Message');
      }

      if (message.senderId.toString() !== userId.toString()) {
        throw new ForbiddenError('You can only edit your own messages');
      }

      if (message.deletedAt) {
        throw new BadRequestError('Cannot edit deleted message');
      }

      // Encrypt new content
      const conversation = await Conversation.findById(message.conversationId);
      const conversationKey = Buffer.from(conversation.conversationKey, 'base64');
      const encryptedData = encryptionService.encryptMessage(newContent, conversationKey);
      const contentHash = encryptionService.hashContent(newContent);

      // Update message
      message.encryptedContent = JSON.stringify(encryptedData);
      message.contentHash = contentHash;
      message.isEdited = true;
      message.editedAt = new Date();
      await message.save();

      // Populate and return
      const populatedMessage = await Message.findById(messageId)
        .populate('senderId', 'name username avatar')
        .populate('replyTo', 'senderId encryptedContent')
        .populate('replyTo.senderId', 'name username avatar');

      // Decrypt message content for response
      const msgObj = populatedMessage.toObject();
      const decryptedContent = this.decryptMessageContent(msgObj, conversationKey);
      
      const responseMessage = {
        ...msgObj,
        content: decryptedContent,
      };

      // Decrypt replyTo message if exists
      if (responseMessage.replyTo && responseMessage.replyTo.encryptedContent) {
        try {
          const replyDecrypted = this.decryptMessageContent(responseMessage.replyTo, conversationKey);
          responseMessage.replyTo.content = replyDecrypted;
        } catch (error) {
          logger.error('Failed to decrypt reply message:', error);
        }
      }

      logger.info(`Message edited: ${messageId} by ${userId}`);

      // Emit socket event
      try {
        await chatSocketService.emitMessageEdited(message.conversationId.toString(), messageId.toString(), responseMessage);
      } catch (socketError) {
        logger.error('[MessageService] Failed to emit socket event:', socketError);
      }

      return responseMessage;
    } catch (error) {
      logger.error('Edit message error:', error);
      throw error;
    }
  }

  /**
   * Delete a message
   * @param {String} messageId - Message ID
   * @param {String} userId - User ID (must be sender or admin)
   * @param {String} deleteFor - 'me' or 'everyone' (default: 'everyone')
   * @returns {Object} - Deleted message
   */
  async deleteMessage(messageId, userId, deleteFor = 'everyone') {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new NotFoundError('Message');
      }

      // Check permissions
      const isSender = message.senderId.toString() === userId.toString();
      
      if (!isSender && deleteFor === 'everyone') {
        // Check if user is admin/owner (only for delete for everyone)
        const participant = await Participant.findOne({
          conversationId: message.conversationId,
          userId,
          isActive: true,
          role: { $in: ['owner', 'admin'] },
        });

        if (!participant) {
          throw new ForbiddenError('You can only delete your own messages for everyone');
        }
      }

      if (deleteFor === 'me') {
        // Delete for me only - create a record in MessageDeleted
        await MessageDeleted.findOneAndUpdate(
          { messageId, userId },
          {
            messageId,
            userId,
            conversationId: message.conversationId,
            deletedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        logger.info(`Message deleted for user: ${messageId} by ${userId}`);
      } else {
        // Delete for everyone - soft delete the message
        await message.softDelete(userId);

        // Update conversation message count
        await Conversation.updateOne(
          { _id: message.conversationId },
          { $inc: { messageCount: -1 } }
        );

        logger.info(`Message deleted for everyone: ${messageId} by ${userId}`);
      }

      // Emit socket event
      try {
        await chatSocketService.emitMessageDeleted(
          message.conversationId.toString(), 
          messageId.toString(), 
          userId,
          deleteFor
        );
      } catch (socketError) {
        logger.error('[MessageService] Failed to emit socket event:', socketError);
      }

      return message;
    } catch (error) {
      logger.error('Delete message error:', error);
      throw error;
    }
  }

  /**
   * Add reaction to message
   * @param {String} messageId - Message ID
   * @param {String} userId - User ID
   * @param {String} emoji - Emoji string
   * @returns {Object} - Reaction object
   */
  async addReaction(messageId, userId, emoji) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new NotFoundError('Message');
      }

      // Check if user is participant
      const participant = await Participant.findOne({
        conversationId: message.conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      // Check if reaction already exists
      const existingReaction = await MessageReaction.findOne({
        messageId,
        userId,
        emoji,
      });

      if (existingReaction) {
        // Remove reaction (toggle off)
        await MessageReaction.deleteOne({ _id: existingReaction._id });
        
        // Update message reaction count
        message.reactionsCount = Math.max(0, message.reactionsCount - 1);
        await message.save();

        // Emit socket event
        try {
          await chatSocketService.emitMessageReaction(
            message.conversationId.toString(),
            messageId.toString(),
            { emoji: existingReaction.emoji, userId: existingReaction.userId, removed: true },
            userId
          );
        } catch (socketError) {
          logger.error('[MessageService] Failed to emit socket event:', socketError);
        }

        return { removed: true, reaction: existingReaction };
      }

      // Create new reaction
      const reaction = new MessageReaction({
        messageId,
        userId,
        emoji,
        conversationId: message.conversationId,
      });

      await reaction.save();

      // Update message reaction count
      message.reactionsCount += 1;
      await message.save();

      // Populate reaction
      const populatedReaction = await MessageReaction.findById(reaction._id)
        .populate('userId', 'name username avatar');

      logger.info(`Reaction added: ${reaction._id} to message ${messageId} by ${userId}`);

      // Emit socket event
      try {
        await chatSocketService.emitMessageReaction(
          message.conversationId.toString(),
          messageId.toString(),
          { emoji: reaction.emoji, userId: reaction.userId, removed: false },
          userId
        );
      } catch (socketError) {
        logger.error('[MessageService] Failed to emit socket event:', socketError);
      }

      return { removed: false, reaction: populatedReaction };
    } catch (error) {
      logger.error('Add reaction error:', error);
      throw error;
    }
  }

  /**
   * Mark message as read
   * @param {String} messageId - Message ID
   * @param {String} userId - User ID
   * @returns {Object} - Read receipt
   */
  async markMessageAsRead(messageId, userId) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new NotFoundError('Message');
      }

      // Check if user is participant
      const participant = await Participant.findOne({
        conversationId: message.conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      // Check if already read
      const existingRead = await MessageRead.findOne({
        messageId,
        userId,
      });

      if (existingRead) {
        return existingRead;
      }

      // Create read receipt
      const messageRead = new MessageRead({
        messageId,
        userId,
        conversationId: message.conversationId,
        readAt: new Date(),
      });

      await messageRead.save();

      // Update message read count
      message.readCount += 1;
      await message.save();

      // Update participant unread count (decrement if > 0)
      if (participant.unreadCount > 0) {
        participant.unreadCount = Math.max(0, participant.unreadCount - 1);
        participant.lastReadAt = new Date();
        await participant.save();
      }

      logger.info(`Message marked as read: ${messageId} by ${userId}`);

      // Emit socket event
      try {
        await chatSocketService.emitMessageRead(message.conversationId.toString(), messageId.toString(), userId);
      } catch (socketError) {
        logger.error('[MessageService] Failed to emit socket event:', socketError);
      }

      return messageRead;
    } catch (error) {
      logger.error('Mark message as read error:', error);
      throw error;
    }
  }

  /**
   * Mark all messages in conversation as read
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User ID
   * @returns {Object} - { markedCount }
   */
  async markAllMessagesAsRead(conversationId, userId) {
    try {
      // Check if user is participant
      const participant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      // Get all unread messages
      const unreadMessages = await Message.find({
        conversationId,
        deletedAt: null,
        createdAt: { $gt: participant.lastReadAt || new Date(0) },
      });

      const messageIds = unreadMessages.map(m => m._id);

      // Get already read messages
      const existingReads = await MessageRead.find({
        messageId: { $in: messageIds },
        userId,
      });

      const readMessageIds = new Set(existingReads.map(r => r.messageId.toString()));
      const newMessageIds = messageIds.filter(id => !readMessageIds.has(id.toString()));

      // Create read receipts for new messages
      if (newMessageIds.length > 0) {
        const readReceipts = newMessageIds.map(messageId => ({
          messageId,
          userId,
          conversationId,
          readAt: new Date(),
        }));

        await MessageRead.insertMany(readReceipts);

        // Update message read counts
        await Message.updateMany(
          { _id: { $in: newMessageIds } },
          { $inc: { readCount: 1 } }
        );
      }

      // Update participant
      participant.unreadCount = 0;
      participant.lastReadAt = new Date();
      await participant.save();

      logger.info(`All messages marked as read in conversation ${conversationId} by ${userId}`);

      // Emit socket event
      try {
        await chatSocketService.emitMessagesRead(conversationId, userId, newMessageIds.map(id => id.toString()));
      } catch (socketError) {
        logger.error('[MessageService] Failed to emit socket event:', socketError);
      }

      return { markedCount: newMessageIds.length };
    } catch (error) {
      logger.error('Mark all messages as read error:', error);
      throw error;
    }
  }

  /**
   * Pin or unpin a message
   * @param {String} messageId - Message ID
   * @param {String} userId - User ID (must be admin/owner)
   * @param {Boolean} pin - Pin or unpin
   * @returns {Object} - Updated message
   */
  async pinMessage(messageId, userId, pin = true) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new NotFoundError('Message');
      }

      // Check permissions
      const participant = await Participant.findOne({
        conversationId: message.conversationId,
        userId,
        isActive: true,
        role: { $in: ['owner', 'admin'] },
      });

      if (!participant) {
        throw new ForbiddenError('Only admins and owners can pin messages');
      }

      message.isPinned = pin;
      message.pinnedAt = pin ? new Date() : null;
      message.pinnedBy = pin ? userId : null;
      await message.save();

      const populatedMessage = await Message.findById(messageId)
        .populate('senderId', 'name username avatar')
        .populate('pinnedBy', 'name username avatar');

      logger.info(`Message ${pin ? 'pinned' : 'unpinned'}: ${messageId} by ${userId}`);

      return populatedMessage;
    } catch (error) {
      logger.error('Pin message error:', error);
      throw error;
    }
  }

  /**
   * Get pinned messages for a conversation
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User ID
   * @returns {Array} - Pinned messages
   */
  async getPinnedMessages(conversationId, userId) {
    try {
      // Check if user is participant
      const participant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      const messages = await Message.find({
        conversationId,
        isPinned: true,
        deletedAt: null,
      })
        .populate('senderId', 'name username avatar')
        .populate('pinnedBy', 'name username avatar')
        .sort({ pinnedAt: -1 });

      return messages;
    } catch (error) {
      logger.error('Get pinned messages error:', error);
      throw error;
    }
  }

  /**
   * Search messages in conversation
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User ID
   * @param {String} query - Search query
   * @param {Object} options - { page, limit }
   * @returns {Object} - { messages, total }
   */
  async searchMessages(conversationId, userId, query, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const skip = (page - 1) * limit;

      // Check if user is participant
      const participant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      // Hash the search query for matching
      const queryHash = encryptionService.hashContent(query.toLowerCase());

      // Search messages (using contentHash for now - in production, use full-text search)
      const messages = await Message.find({
        conversationId,
        deletedAt: null,
        // Note: This is a simplified search. In production, use MongoDB text search or Elasticsearch
        // with encrypted search indexes
      })
        .populate('senderId', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Filter by content hash (simplified - real search would be more complex with encryption)
      const filteredMessages = messages.filter(msg => {
        // In production, you'd decrypt and search, or use searchable encryption
        // For now, we'll return all messages and let client filter
        return true;
      });

      const total = await Message.countDocuments({
        conversationId,
        deletedAt: null,
      });

      return {
        messages: filteredMessages,
        total: filteredMessages.length,
        page,
        limit,
      };
    } catch (error) {
      logger.error('Search messages error:', error);
      throw error;
    }
  }
}

module.exports = new MessageService();

