const { Participant, Conversation } = require('../models');
const { logger } = require('../../../core/utils/logger');
const { verifyAccessToken } = require('../../auth/utils/jwt.utils');

class ChatSocketService {
  constructor() {
    this.io = null;
    
    // Chat-specific event types
    this.eventTypes = {
      // Message events
      MESSAGE_SENT: 'chat:message:sent',
      MESSAGE_RECEIVED: 'chat:message:received',
      MESSAGE_EDITED: 'chat:message:edited',
      MESSAGE_DELETED: 'chat:message:deleted',
      MESSAGE_READ: 'chat:message:read',
      MESSAGE_REACTION: 'chat:message:reaction',
      
      // Conversation events
      CONVERSATION_CREATED: 'chat:conversation:created',
      CONVERSATION_UPDATED: 'chat:conversation:updated',
      CONVERSATION_PARTICIPANT_ADDED: 'chat:conversation:participant:added',
      CONVERSATION_PARTICIPANT_REMOVED: 'chat:conversation:participant:removed',
      
      // Typing indicators
      TYPING_START: 'chat:typing:start',
      TYPING_STOP: 'chat:typing:stop',
      
      // Online status
      USER_ONLINE: 'chat:user:online',
      USER_OFFLINE: 'chat:user:offline',
      
      // Read receipts
      MESSAGES_READ: 'chat:messages:read',
    };
  }

  /**
   * Initialize chat socket handlers
   * @param {Object} io - Socket.io instance
   */
  initialize(io) {
    this.io = io;
    this.setupChatHandlers();
    logger.info('[ChatSocketService] Chat socket handlers initialized');
  }

  /**
   * Set up chat-specific socket event handlers
   */
  setupChatHandlers() {
    this.io.on('connection', (socket) => {
      // Handle authentication (middleware style)
      socket.on('authenticate', async (data) => {
        try {
          const { token } = data;
          
          if (!token) {
            socket.emit('error', { message: 'Authentication token required' });
            return;
          }

          // Verify JWT token
          const decoded = verifyAccessToken(token);
          socket.userId = decoded.userId.toString();
          socket.authenticated = true;

          // Join user's personal room
          const userRoom = `user:${socket.userId}`;
          socket.join(userRoom);

          // Join all user's conversation rooms
          await this.joinUserConversations(socket.userId, socket);

          // Emit authenticated event
          socket.emit('authenticated', {
            userId: socket.userId,
            socketId: socket.id,
            timestamp: new Date().toISOString(),
          });

          // Notify others that user is online
          this.emitUserOnline(socket.userId);

          logger.info(`[ChatSocketService] User ${socket.userId} authenticated via socket`);
        } catch (error) {
          logger.error('[ChatSocketService] Authentication error:', error);
          socket.emit('error', { message: 'Authentication failed', error: error.message });
        }
      });

      // Handle joining a conversation room
      socket.on('chat:join_conversation', async (data) => {
        try {
          logger.info(`[ChatSocketService] ========== JOIN CONVERSATION REQUEST ==========`);
          logger.info(`[ChatSocketService] Socket ID: ${socket.id}`);
          logger.info(`[ChatSocketService] User ID: ${socket.userId}`);
          logger.info(`[ChatSocketService] Authenticated: ${socket.authenticated}`);
          logger.info(`[ChatSocketService] Request data:`, data);
          
          if (!socket.authenticated) {
            logger.warn(`[ChatSocketService] Join rejected - not authenticated`);
            socket.emit('error', { message: 'Not authenticated' });
            return;
          }

          const { conversationId } = data;
          
          // Verify user is participant
          const participant = await Participant.findOne({
            conversationId,
            userId: socket.userId,
            isActive: true,
          });

          if (!participant) {
            logger.warn(`[ChatSocketService] Join rejected - not a participant`);
            socket.emit('error', { message: 'Not a participant in this conversation' });
            return;
          }

          const room = `conversation:${conversationId}`;
          socket.join(room);
          
          // Get room info
          const socketsInRoom = await this.io.in(room).fetchSockets();
          const socketCount = socketsInRoom ? socketsInRoom.length : 0;
          
          logger.info(`[ChatSocketService] User ${socket.userId} joined conversation ${conversationId}`);
          logger.info(`[ChatSocketService] Room: ${room}`);
          logger.info(`[ChatSocketService] Total sockets in room: ${socketCount}`);
          
          socket.emit('chat:conversation:joined', { conversationId, room, socketCount });
          logger.info(`[ChatSocketService] ==============================================`);
        } catch (error) {
          logger.error('[ChatSocketService] Join conversation error:', error);
          socket.emit('error', { message: 'Failed to join conversation', error: error.message });
        }
      });

      // Handle leaving a conversation room
      socket.on('chat:leave_conversation', async (data) => {
        try {
          if (!socket.authenticated) {
            return;
          }

          const { conversationId } = data;
          const room = `conversation:${conversationId}`;
          socket.leave(room);
          
          socket.emit('chat:conversation:left', { conversationId, room });
          logger.debug(`[ChatSocketService] User ${socket.userId} left conversation ${conversationId}`);
        } catch (error) {
          logger.error('[ChatSocketService] Leave conversation error:', error);
        }
      });

      // Handle typing indicators
      socket.on('chat:typing:start', async (data) => {
        try {
          logger.info(`[ChatSocketService] ========== TYPING START REQUEST ==========`);
          logger.info(`[ChatSocketService] Socket ID: ${socket.id}`);
          logger.info(`[ChatSocketService] User ID: ${socket.userId}`);
          logger.info(`[ChatSocketService] Authenticated: ${socket.authenticated}`);
          logger.info(`[ChatSocketService] Request data:`, data);
          
          if (!socket.authenticated) {
            logger.warn(`[ChatSocketService] ❌ Typing start rejected - not authenticated`);
            return;
          }

          const { conversationId } = data;
          
          // Verify user is participant
          const participant = await Participant.findOne({
            conversationId,
            userId: socket.userId,
            isActive: true,
          });

          if (!participant) {
            logger.warn(`[ChatSocketService] ❌ Typing start rejected - not a participant`);
            return;
          }

          const room = `conversation:${conversationId}`;
          
          // Get sockets in room before emitting
          const socketsInRoom = await this.io.in(room).fetchSockets();
          const socketCount = socketsInRoom ? socketsInRoom.length : 0;
          
          logger.info(`[ChatSocketService] ✅ Emitting typing start to room: ${room}`);
          logger.info(`[ChatSocketService] Sockets in room: ${socketCount}`);
          logger.info(`[ChatSocketService] Event type: ${this.eventTypes.TYPING_START}`);
          
          const eventData = {
            conversationId,
            userId: socket.userId,
            timestamp: new Date().toISOString(),
          };
          
          this.io.to(room).emit(this.eventTypes.TYPING_START, eventData);
          
          logger.info(`[ChatSocketService] Typing start event emitted successfully`);
          logger.info(`[ChatSocketService] Event data:`, eventData);
          logger.info(`[ChatSocketService] ==============================================`);
        } catch (error) {
          logger.error('[ChatSocketService] Typing start error:', error);
        }
      });

      socket.on('chat:typing:stop', async (data) => {
        try {
          logger.info(`[ChatSocketService] ========== TYPING STOP REQUEST ==========`);
          logger.info(`[ChatSocketService] Socket ID: ${socket.id}`);
          logger.info(`[ChatSocketService] User ID: ${socket.userId}`);
          logger.info(`[ChatSocketService] Authenticated: ${socket.authenticated}`);
          logger.info(`[ChatSocketService] Request data:`, data);
          
          if (!socket.authenticated) {
            logger.warn(`[ChatSocketService] ❌ Typing stop rejected - not authenticated`);
            return;
          }

          const { conversationId } = data;
          const room = `conversation:${conversationId}`;
          
          // Get sockets in room before emitting
          const socketsInRoom = await this.io.in(room).fetchSockets();
          const socketCount = socketsInRoom ? socketsInRoom.length : 0;
          
          logger.info(`[ChatSocketService] ✅ Emitting typing stop to room: ${room}`);
          logger.info(`[ChatSocketService] Sockets in room: ${socketCount}`);
          logger.info(`[ChatSocketService] Event type: ${this.eventTypes.TYPING_STOP}`);
          
          const eventData = {
            conversationId,
            userId: socket.userId,
            timestamp: new Date().toISOString(),
          };
          
          this.io.to(room).emit(this.eventTypes.TYPING_STOP, eventData);
          
          logger.info(`[ChatSocketService] Typing stop event emitted successfully`);
          logger.info(`[ChatSocketService] ==============================================`);
        } catch (error) {
          logger.error('[ChatSocketService] Typing stop error:', error);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        try {
          if (socket.userId && socket.authenticated) {
            // Notify others that user is offline
            this.emitUserOffline(socket.userId);
            logger.info(`[ChatSocketService] User ${socket.userId} disconnected`);
          }
        } catch (error) {
          logger.error('[ChatSocketService] Disconnect error:', error);
        }
      });
    });
  }

  /**
   * Join user to all their conversation rooms
   */
  async joinUserConversations(userId, socket) {
    try {
      const participants = await Participant.find({
        userId,
        isActive: true,
      }).select('conversationId');

      for (const participant of participants) {
        const room = `conversation:${participant.conversationId}`;
        socket.join(room);
      }

      logger.debug(`[ChatSocketService] User ${userId} joined ${participants.length} conversation rooms`);
    } catch (error) {
      logger.error('[ChatSocketService] Join user conversations error:', error);
    }
  }

  /**
   * Emit message sent event to conversation participants
   */
  async emitMessageSent(conversationId, message, senderId) {
    try {
      const room = `conversation:${conversationId}`;
      
      // Get room info for debugging
      const socketsInRoom = await this.io.in(room).fetchSockets();
      const socketCount = socketsInRoom ? socketsInRoom.length : 0;
      
      logger.info(`[ChatSocketService] ========== EMITTING MESSAGE_SENT ==========`);
      logger.info(`[ChatSocketService] Conversation ID: ${conversationId}`);
      logger.info(`[ChatSocketService] Room: ${room}`);
      logger.info(`[ChatSocketService] Sockets in room: ${socketCount}`);
      logger.info(`[ChatSocketService] Sender ID: ${senderId}`);
      logger.info(`[ChatSocketService] Message ID: ${message._id || message.id}`);
      
      const eventData = {
        conversationId,
        message,
        senderId,
        timestamp: new Date().toISOString(),
      };
      
      this.io.to(room).emit(this.eventTypes.MESSAGE_SENT, eventData);
      
      // Also emit to sender's personal room for debugging
      this.io.to(`user:${senderId}`).emit(this.eventTypes.MESSAGE_SENT, eventData);
      
      logger.info(`[ChatSocketService] Emitted MESSAGE_SENT to room "${room}" and user room "user:${senderId}"`);
      logger.info(`[ChatSocketService] Event type: ${this.eventTypes.MESSAGE_SENT}`);
      logger.info(`[ChatSocketService] ==============================================`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit message sent error:', error);
    }
  }

  /**
   * Emit message received event to sender
   */
  async emitMessageReceived(conversationId, message, recipientId) {
    try {
      const userRoom = `user:${recipientId}`;
      
      this.io.to(userRoom).emit(this.eventTypes.MESSAGE_RECEIVED, {
        conversationId,
        message,
        timestamp: new Date().toISOString(),
      });

      logger.debug(`[ChatSocketService] Emitted MESSAGE_RECEIVED to user ${recipientId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit message received error:', error);
    }
  }

  /**
   * Emit message edited event
   */
  async emitMessageEdited(conversationId, messageId, updatedMessage) {
    try {
      const room = `conversation:${conversationId}`;
      
      this.io.to(room).emit(this.eventTypes.MESSAGE_EDITED, {
        conversationId,
        messageId,
        message: updatedMessage,
        timestamp: new Date().toISOString(),
      });

      logger.debug(`[ChatSocketService] Emitted MESSAGE_EDITED to conversation ${conversationId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit message edited error:', error);
    }
  }

  /**
   * Emit message deleted event
   */
  async emitMessageDeleted(conversationId, messageId, deletedBy, deleteFor = 'everyone') {
    try {
      const room = `conversation:${conversationId}`;
      
      this.io.to(room).emit(this.eventTypes.MESSAGE_DELETED, {
        conversationId,
        messageId,
        deletedBy,
        deleteFor,
        timestamp: new Date().toISOString(),
      });

      logger.debug(`[ChatSocketService] Emitted MESSAGE_DELETED to conversation ${conversationId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit message deleted error:', error);
    }
  }

  /**
   * Emit message read event
   */
  async emitMessageRead(conversationId, messageId, userId) {
    try {
      const room = `conversation:${conversationId}`;
      
      this.io.to(room).emit(this.eventTypes.MESSAGE_READ, {
        conversationId,
        messageId,
        userId,
        timestamp: new Date().toISOString(),
      });

      logger.debug(`[ChatSocketService] Emitted MESSAGE_READ to conversation ${conversationId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit message read error:', error);
    }
  }

  /**
   * Emit message reaction event
   */
  async emitMessageReaction(conversationId, messageId, reaction, userId) {
    try {
      const room = `conversation:${conversationId}`;
      
      this.io.to(room).emit(this.eventTypes.MESSAGE_REACTION, {
        conversationId,
        messageId,
        reaction,
        userId,
        timestamp: new Date().toISOString(),
      });

      logger.debug(`[ChatSocketService] Emitted MESSAGE_REACTION to conversation ${conversationId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit message reaction error:', error);
    }
  }

  /**
   * Emit conversation created event
   */
  async emitConversationCreated(conversation, participantIds) {
    try {
      // Emit to all participants
      for (const participantId of participantIds) {
        const userRoom = `user:${participantId}`;
        this.io.to(userRoom).emit(this.eventTypes.CONVERSATION_CREATED, {
          conversation,
          timestamp: new Date().toISOString(),
        });
      }

      logger.debug(`[ChatSocketService] Emitted CONVERSATION_CREATED to ${participantIds.length} users`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit conversation created error:', error);
    }
  }

  /**
   * Emit conversation updated event
   */
  async emitConversationUpdated(conversationId, updates) {
    try {
      const room = `conversation:${conversationId}`;
      
      this.io.to(room).emit(this.eventTypes.CONVERSATION_UPDATED, {
        conversationId,
        updates,
        timestamp: new Date().toISOString(),
      });

      logger.debug(`[ChatSocketService] Emitted CONVERSATION_UPDATED to conversation ${conversationId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit conversation updated error:', error);
    }
  }

  /**
   * Emit participant added event
   */
  async emitParticipantAdded(conversationId, participant) {
    try {
      const room = `conversation:${conversationId}`;
      
      this.io.to(room).emit(this.eventTypes.CONVERSATION_PARTICIPANT_ADDED, {
        conversationId,
        participant,
        timestamp: new Date().toISOString(),
      });

      // Also notify the new participant
      const userRoom = `user:${participant.userId}`;
      this.io.to(userRoom).emit(this.eventTypes.CONVERSATION_CREATED, {
        conversation: { _id: conversationId },
        timestamp: new Date().toISOString(),
      });

      logger.debug(`[ChatSocketService] Emitted PARTICIPANT_ADDED to conversation ${conversationId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit participant added error:', error);
    }
  }

  /**
   * Emit participant removed event
   */
  async emitParticipantRemoved(conversationId, participantId) {
    try {
      const room = `conversation:${conversationId}`;
      
      this.io.to(room).emit(this.eventTypes.CONVERSATION_PARTICIPANT_REMOVED, {
        conversationId,
        participantId,
        timestamp: new Date().toISOString(),
      });

      logger.debug(`[ChatSocketService] Emitted PARTICIPANT_REMOVED to conversation ${conversationId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit participant removed error:', error);
    }
  }

  /**
   * Emit user online status
   */
  async emitUserOnline(userId) {
    try {
      // Get all conversations where user is a participant
      const participants = await Participant.find({
        userId,
        isActive: true,
      }).select('conversationId');

      for (const participant of participants) {
        const room = `conversation:${participant.conversationId}`;
        this.io.to(room).emit(this.eventTypes.USER_ONLINE, {
          userId,
          conversationId: participant.conversationId,
          timestamp: new Date().toISOString(),
        });
      }

      logger.debug(`[ChatSocketService] Emitted USER_ONLINE for user ${userId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit user online error:', error);
    }
  }

  /**
   * Emit user offline status
   */
  async emitUserOffline(userId) {
    try {
      // Get all conversations where user is a participant
      const participants = await Participant.find({
        userId,
        isActive: true,
      }).select('conversationId');

      for (const participant of participants) {
        const room = `conversation:${participant.conversationId}`;
        this.io.to(room).emit(this.eventTypes.USER_OFFLINE, {
          userId,
          conversationId: participant.conversationId,
          timestamp: new Date().toISOString(),
        });
      }

      logger.debug(`[ChatSocketService] Emitted USER_OFFLINE for user ${userId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit user offline error:', error);
    }
  }

  /**
   * Emit messages read event
   */
  async emitMessagesRead(conversationId, userId, messageIds) {
    try {
      const room = `conversation:${conversationId}`;
      
      this.io.to(room).emit(this.eventTypes.MESSAGES_READ, {
        conversationId,
        userId,
        messageIds,
        timestamp: new Date().toISOString(),
      });

      logger.debug(`[ChatSocketService] Emitted MESSAGES_READ to conversation ${conversationId}`);
    } catch (error) {
      logger.error('[ChatSocketService] Emit messages read error:', error);
    }
  }
}

// Create singleton instance
const chatSocketService = new ChatSocketService();

module.exports = chatSocketService;

