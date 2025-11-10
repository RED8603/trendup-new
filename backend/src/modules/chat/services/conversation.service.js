const { Conversation, Participant, Message } = require('../models');
const { User } = require('../../auth/models');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../../../core/errors/AppError');
const { logger } = require('../../../core/utils/logger');
const encryptionService = require('./encryption.service');
const chatSocketService = require('./chat.socket.service');
const notificationService = require('../../../core/services/notification.service.simple');
const mongoose = require('mongoose');

class ConversationService {
  /**
   * Create a direct (1-to-1) conversation
   * @param {String} userId - Current user ID
   * @param {String} otherUserId - Other user ID
   * @returns {Object} - Conversation object
   */
  async createDirectConversation(userId, otherUserId) {
    try {
      // Validate users exist
      const [user, otherUser] = await Promise.all([
        User.findById(userId),
        User.findById(otherUserId),
      ]);

      if (!user || !otherUser) {
        throw new NotFoundError('User not found');
      }

      if (userId === otherUserId) {
        throw new BadRequestError('Cannot create conversation with yourself');
      }

      // Check participants to see if conversation exists
      const existingParticipants = await Participant.find({
        userId: { $in: [userId, otherUserId] },
        isActive: true,
      }).populate('conversationId');

      // Find conversation where both users are participants
      const conversationMap = new Map();
      existingParticipants.forEach(p => {
        if (p.conversationId && p.conversationId.type === 'direct') {
          const convId = p.conversationId._id.toString();
          if (!conversationMap.has(convId)) {
            conversationMap.set(convId, []);
          }
          conversationMap.get(convId).push(p.userId.toString());
        }
      });

      // Check if we have a conversation with both users
      for (const [convId, userIds] of conversationMap.entries()) {
        if (userIds.includes(userId) && userIds.includes(otherUserId)) {
          const existingConv = await this.getConversationById(convId, userId);
          if (existingConv) {
            return existingConv;
          }
        }
      }

      // Create new conversation
      const conversationKey = encryptionService.generateKey();
      const conversation = new Conversation({
        type: 'direct',
        encryptionEnabled: true,
        conversationKey: conversationKey.toString('base64'), // Store encrypted separately per user
      });

      await conversation.save();

      // Create participants
      const participants = [
        new Participant({
          conversationId: conversation._id,
          userId: userId,
          role: 'owner',
          unreadCount: 0,
        }),
        new Participant({
          conversationId: conversation._id,
          userId: otherUserId,
          role: 'owner',
          unreadCount: 0,
        }),
      ];

      await Participant.insertMany(participants);

      // Populate conversation
      const populatedConversation = await this.getConversationById(conversation._id.toString(), userId);

      logger.info(`Direct conversation created: ${conversation._id} between ${userId} and ${otherUserId}`);

      // Emit socket event
      try {
        await chatSocketService.emitConversationCreated(populatedConversation, [userId, otherUserId]);
      } catch (socketError) {
        logger.error('[ConversationService] Failed to emit socket event:', socketError);
      }

      // Send notification to other user
      try {
        const notification = await notificationService.createNotification(
          otherUserId,
          notificationService.notificationTypes.CONVERSATION_CREATED,
          {
            conversationId: conversation._id.toString(),
            conversationType: 'direct',
            createdBy: {
              userId: user._id.toString(),
              name: user.name,
              username: user.username,
              avatar: user.avatar,
            },
          },
          notificationService.priorityLevels.MEDIUM
        );
        await notificationService.sendNotification(otherUserId, notification);
      } catch (notifError) {
        logger.error('[ConversationService] Failed to send notification:', notifError);
        // Don't fail conversation creation if notification fails
      }
      
      return populatedConversation;
    } catch (error) {
      logger.error('Create direct conversation error:', error);
      throw error;
    }
  }

  /**
   * Create a group conversation
   * @param {String} userId - Creator user ID
   * @param {Object} groupData - { name, description, avatar, participantIds }
   * @returns {Object} - Conversation object
   */
  async createGroupConversation(userId, groupData) {
    try {
      const { name, description, avatar, participantIds = [] } = groupData;

      // Validate name
      if (!name || name.trim().length === 0) {
        throw new BadRequestError('Group name is required');
      }

      // Validate participant count (max 10 including creator)
      // Convert all IDs to ObjectIds for consistent comparison
      // Ensure userId is ObjectId first
      const currentUserId = userId instanceof mongoose.Types.ObjectId ? userId : new mongoose.Types.ObjectId(userId);
      
      const allParticipantIds = [
        currentUserId,
        ...participantIds.map(id => 
          mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id
        )
      ];
      // Remove duplicates by converting to strings, then back to ObjectIds
      const uniqueParticipantStrings = [...new Set(allParticipantIds.map(id => id.toString()))];
      const participantObjectIds = uniqueParticipantStrings.map(id => new mongoose.Types.ObjectId(id));
      
      if (participantObjectIds.length < 2) {
        throw new BadRequestError('Group must have at least 2 participants');
      }
      if (participantObjectIds.length > 10) {
        throw new BadRequestError('Group cannot have more than 10 participants');
      }

      // Validate all users exist - convert to ObjectIds for query
      const users = await User.find({ _id: { $in: participantObjectIds } });
      if (users.length !== participantObjectIds.length) {
        const foundUserIds = users.map(u => u._id.toString());
        const missingUserIds = participantObjectIds
          .map(id => id.toString())
          .filter(id => !foundUserIds.includes(id));
        logger.error(`Missing users: ${missingUserIds.join(', ')}`);
        throw new NotFoundError(`One or more users not found: ${missingUserIds.join(', ')}`);
      }

      // Create conversation
      const conversationKey = encryptionService.generateKey();
      const conversation = new Conversation({
        type: 'group',
        name: name.trim(),
        description: description?.trim() || null,
        avatar: avatar || null,
        ownerId: currentUserId,
        encryptionEnabled: true,
        conversationKey: conversationKey.toString('base64'),
      });

      await conversation.save();

      // Create participants
      const participants = participantObjectIds.map((participantId) => {
        const role = participantId.toString() === currentUserId.toString() ? 'owner' : 'member';
        return {
          conversationId: conversation._id,
          userId: participantId,
          role,
          unreadCount: 0,
        };
      });

      await Participant.insertMany(participants);

      // Populate conversation
      const populatedConversation = await this.getConversationById(conversation._id.toString(), userId);

      logger.info(`Group conversation created: ${conversation._id} by ${userId} with ${participantObjectIds.length} participants`);

      // Emit socket event
      try {
        await chatSocketService.emitConversationCreated(populatedConversation, participantObjectIds.map(id => id.toString()));
      } catch (socketError) {
        logger.error('[ConversationService] Failed to emit socket event:', socketError);
      }

      // Send notifications to all participants except creator
      const creator = users.find(u => u._id.toString() === currentUserId.toString());
      const otherParticipants = participantObjectIds.filter(id => id.toString() !== currentUserId.toString());
      
      for (const participantId of otherParticipants) {
        try {
          const notification = await notificationService.createNotification(
            participantId.toString(),
            notificationService.notificationTypes.CONVERSATION_CREATED,
            {
              conversationId: conversation._id.toString(),
              conversationType: 'group',
              groupName: name.trim(),
              createdBy: {
                userId: creator._id.toString(),
                name: creator.name,
                username: creator.username,
                avatar: creator.avatar,
              },
            },
            notificationService.priorityLevels.MEDIUM
          );
          await notificationService.sendNotification(participantId.toString(), notification);
        } catch (notifError) {
          logger.error(`[ConversationService] Failed to send notification to ${participantId}:`, notifError);
          // Continue with other participants
        }
      }

      return populatedConversation;
    } catch (error) {
      logger.error('Create group conversation error:', error);
      throw error;
    }
  }

  /**
   * Get conversation by ID with authorization check
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User ID requesting
   * @returns {Object} - Conversation object
   */
  async getConversationById(conversationId, userId) {
    try {
      // Check if user is a participant
      const participant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      // Get conversation
      const conversation = await Conversation.findById(conversationId)
        .populate('ownerId', 'name username avatar')
        .populate('lastMessage');

      if (!conversation) {
        throw new NotFoundError('Conversation');
      }

      // Get all participants
      const participants = await Participant.find({
        conversationId,
        isActive: true,
      })
        .populate('userId', 'name username avatar walletAddress')
        .sort({ role: 1, joinedAt: 1 });

      // Get unread count for current user
      const userParticipant = participants.find(p => p.userId._id.toString() === userId);

      return {
        ...conversation.toObject(),
        participants: participants.map(p => ({
          userId: p.userId,
          role: p.role,
          joinedAt: p.joinedAt,
          unreadCount: p.userId._id.toString() === userId ? p.unreadCount : undefined,
          muted: p.userId._id.toString() === userId ? p.muted : undefined,
        })),
        unreadCount: userParticipant?.unreadCount || 0,
      };
    } catch (error) {
      logger.error('Get conversation error:', error);
      throw error;
    }
  }

  /**
   * Get all conversations for a user
   * @param {String} userId - User ID
   * @param {Object} options - { page, limit, archived }
   * @returns {Object} - { conversations, total, page, limit }
   */
  async getUserConversations(userId, options = {}) {
    try {
      const { page = 1, limit = 50, archived = false } = options;
      const skip = (page - 1) * limit;

      // Get user's active conversations
      const participants = await Participant.find({
        userId,
        isActive: true,
      })
        .populate({
          path: 'conversationId',
          match: archived ? { archivedAt: { $ne: null } } : { archivedAt: null },
          populate: [
            { path: 'ownerId', select: 'name username avatar' },
            { path: 'lastMessage', populate: { path: 'senderId', select: 'name username avatar' } },
          ],
        })
        .sort({ 'conversationId.lastMessageAt': -1 })
        .skip(skip)
        .limit(limit);

      // Filter out null conversations (from populate match)
      const validParticipants = participants.filter(p => p.conversationId !== null);

      // Get participant counts for each conversation
      const conversationIds = validParticipants.map(p => p.conversationId._id);
      const participantCounts = await Participant.aggregate([
        { $match: { conversationId: { $in: conversationIds }, isActive: true } },
        { $group: { _id: '$conversationId', count: { $sum: 1 } } },
      ]);

      const countMap = new Map();
      participantCounts.forEach(item => {
        countMap.set(item._id.toString(), item.count);
      });

      // Format conversations
      const conversations = validParticipants.map(participant => {
        const conv = participant.conversationId.toObject();
        return {
          ...conv,
          unreadCount: participant.unreadCount,
          muted: participant.muted,
          participantsCount: countMap.get(conv._id.toString()) || 0,
        };
      });

      // Get all participants for all conversations in one batch query (optimized)
      const allConversationIds = conversations.map(c => c._id);
      const allParticipants = await Participant.find({
        conversationId: { $in: allConversationIds },
        isActive: true,
      })
        .populate('userId', 'name username avatar')
        .lean();

      // Group participants by conversationId
      const participantsByConversation = new Map();
      allParticipants.forEach(p => {
        const convId = p.conversationId.toString();
        if (!participantsByConversation.has(convId)) {
          participantsByConversation.set(convId, []);
        }
        participantsByConversation.get(convId).push({
          userId: p.userId,
          role: p.role,
          joinedAt: p.joinedAt,
          muted: p.muted,
          unreadCount: p.unreadCount,
        });
      });

      // Attach participants to each conversation and handle last message
      conversations.forEach(conversation => {
        conversation.participants = participantsByConversation.get(conversation._id.toString()) || [];
        
        // Handle last message content
        if (conversation.lastMessage) {
          // If lastMessage is populated as an object, ensure content is available
          if (typeof conversation.lastMessage === 'object') {
            // If content doesn't exist but encryptedContent does, set a placeholder
            // Note: Full decryption would require the conversation key, which is complex here
            // The content should ideally be decrypted when the message is fetched via getMessages
            if (!conversation.lastMessage.content) {
              if (conversation.lastMessage.encryptedContent) {
                // Message is encrypted but not decrypted - set placeholder
                conversation.lastMessage.content = 'Message';
              } else if (conversation.lastMessage.messageType === 'file') {
                // File message
                conversation.lastMessage.content = '📎 Attachment';
              } else if (conversation.lastMessage.messageType === 'image') {
                conversation.lastMessage.content = '🖼️ Image';
              } else {
                // No content available
                conversation.lastMessage.content = 'Message';
              }
            }
          }
        }
      });

      // Get total count (filter by archived status)
      const allUserParticipants = await Participant.find({
        userId,
        isActive: true,
      }).populate('conversationId');

      const filteredParticipants = allUserParticipants.filter(p => {
        if (!p.conversationId) return false;
        const isArchived = p.conversationId.archivedAt !== null;
        return archived ? isArchived : !isArchived;
      });

      return {
        conversations,
        total: filteredParticipants.length,
        page,
        limit,
        totalPages: Math.ceil(filteredParticipants.length / limit),
      };
    } catch (error) {
      logger.error('Get user conversations error:', error);
      throw error;
    }
  }

  /**
   * Add participants to group conversation
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User requesting (must be admin/owner)
   * @param {Array} participantIds - User IDs to add
   * @returns {Object} - Updated conversation
   */
  async addParticipants(conversationId, userId, participantIds) {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new NotFoundError('Conversation');
      }

      if (conversation.type !== 'group') {
        throw new BadRequestError('Can only add participants to group conversations');
      }

      // Check user permissions
      const userParticipant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!userParticipant || !['owner', 'admin'].includes(userParticipant.role)) {
        throw new ForbiddenError('Only admins and owners can add participants');
      }

      // Get current participant count
      const currentCount = await Participant.countDocuments({
        conversationId,
        isActive: true,
      });

      // Check max participants (10)
      if (currentCount + participantIds.length > 10) {
        throw new BadRequestError('Cannot exceed maximum of 10 participants');
      }

      // Validate users exist and not already participants
      const existingParticipants = await Participant.find({
        conversationId,
        userId: { $in: participantIds },
        isActive: true,
      });

      const existingUserIds = existingParticipants.map(p => p.userId.toString());
      const newParticipantIds = participantIds.filter(id => !existingUserIds.includes(id.toString()));

      if (newParticipantIds.length === 0) {
        throw new BadRequestError('All users are already participants');
      }

      // Validate users exist
      const users = await User.find({ _id: { $in: newParticipantIds } });
      if (users.length !== newParticipantIds.length) {
        throw new NotFoundError('One or more users not found');
      }

      // Add participants
      const participants = newParticipantIds.map(participantId => ({
        conversationId,
        userId: participantId,
        role: 'member',
        unreadCount: 0,
      }));

      await Participant.insertMany(participants);

      const updatedConversation = await this.getConversationById(conversationId, userId);

      // Emit socket events for new participants
      try {
        for (const participantId of newParticipantIds) {
          const newParticipant = participants.find(p => p.userId.toString() === participantId.toString());
          if (newParticipant) {
            await chatSocketService.emitParticipantAdded(conversationId, {
              userId: participantId,
              role: 'member',
            });
          }
        }
      } catch (socketError) {
        logger.error('[ConversationService] Failed to emit socket event:', socketError);
      }

      return updatedConversation;
    } catch (error) {
      logger.error('Add participants error:', error);
      throw error;
    }
  }

  /**
   * Remove participant from group conversation
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User requesting (admin/owner or self)
   * @param {String} participantIdToRemove - User ID to remove
   * @returns {Object} - Updated conversation
   */
  async removeParticipant(conversationId, userId, participantIdToRemove) {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new NotFoundError('Conversation');
      }

      if (conversation.type !== 'group') {
        throw new BadRequestError('Can only remove participants from group conversations');
      }

      // Check permissions (can remove self or admin/owner can remove others)
      const userParticipant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!userParticipant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      const targetParticipant = await Participant.findOne({
        conversationId,
        userId: participantIdToRemove,
        isActive: true,
      });

      if (!targetParticipant) {
        throw new NotFoundError('Participant');
      }

      // Check if user can remove (self or admin/owner removing others)
      const canRemove = userId.toString() === participantIdToRemove.toString() ||
        ['owner', 'admin'].includes(userParticipant.role);

      if (!canRemove) {
        throw new ForbiddenError('You do not have permission to remove this participant');
      }

      // Cannot remove owner
      if (targetParticipant.role === 'owner' && userId.toString() !== participantIdToRemove.toString()) {
        throw new ForbiddenError('Cannot remove conversation owner');
      }

      // Remove participant (soft delete)
      targetParticipant.isActive = false;
      targetParticipant.leftAt = new Date();
      await targetParticipant.save();

      // Emit socket event
      try {
        await chatSocketService.emitParticipantRemoved(conversationId, participantIdToRemove);
      } catch (socketError) {
        logger.error('[ConversationService] Failed to emit socket event:', socketError);
      }

      // If owner left, transfer ownership to first admin or member
      if (targetParticipant.role === 'owner') {
        const newOwner = await Participant.findOne({
          conversationId,
          isActive: true,
          role: { $in: ['admin', 'member'] },
        }).sort({ joinedAt: 1 });

        if (newOwner) {
          newOwner.role = 'owner';
          await newOwner.save();
          conversation.ownerId = newOwner.userId;
          await conversation.save();
        }
      }

      return await this.getConversationById(conversationId, userId);
    } catch (error) {
      logger.error('Remove participant error:', error);
      throw error;
    }
  }

  /**
   * Update group conversation details
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User requesting (must be admin/owner)
   * @param {Object} updates - { name, description, avatar }
   * @returns {Object} - Updated conversation
   */
  async updateGroupConversation(conversationId, userId, updates) {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new NotFoundError('Conversation');
      }

      if (conversation.type !== 'group') {
        throw new BadRequestError('Can only update group conversations');
      }

      // Check permissions
      const participant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
        role: { $in: ['owner', 'admin'] },
      });

      if (!participant) {
        throw new ForbiddenError('Only admins and owners can update group details');
      }

      // Update fields
      if (updates.name !== undefined) {
        conversation.name = updates.name.trim();
      }
      if (updates.description !== undefined) {
        conversation.description = updates.description?.trim() || null;
      }
      if (updates.avatar !== undefined) {
        conversation.avatar = updates.avatar || null;
      }

      await conversation.save();

      const updatedConversation = await this.getConversationById(conversationId, userId);

      // Emit socket event
      try {
        await chatSocketService.emitConversationUpdated(conversationId, updates);
      } catch (socketError) {
        logger.error('[ConversationService] Failed to emit socket event:', socketError);
      }

      return updatedConversation;
    } catch (error) {
      logger.error('Update group conversation error:', error);
      throw error;
    }
  }

  /**
   * Archive or unarchive conversation
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User ID
   * @param {Boolean} archive - Archive or unarchive
   * @returns {Object} - Updated conversation
   */
  async archiveConversation(conversationId, userId, archive = true) {
    try {
      const participant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new NotFoundError('Conversation');
      }

      conversation.archivedAt = archive ? new Date() : null;
      await conversation.save();

      return await this.getConversationById(conversationId, userId);
    } catch (error) {
      logger.error('Archive conversation error:', error);
      throw error;
    }
  }

  /**
   * Mute or unmute conversation for user
   * @param {String} conversationId - Conversation ID
   * @param {String} userId - User ID
   * @param {Boolean} mute - Mute or unmute
   * @param {Date} muteUntil - Optional mute until date
   * @returns {Object} - Updated participant
   */
  async muteConversation(conversationId, userId, mute = true, muteUntil = null) {
    try {
      const participant = await Participant.findOne({
        conversationId,
        userId,
        isActive: true,
      });

      if (!participant) {
        throw new ForbiddenError('You are not a participant in this conversation');
      }

      participant.muted = mute;
      participant.mutedUntil = muteUntil || null;
      await participant.save();

      return participant;
    } catch (error) {
      logger.error('Mute conversation error:', error);
      throw error;
    }
  }
}

module.exports = new ConversationService();

