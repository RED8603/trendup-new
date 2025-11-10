const mongoose = require('mongoose');

/**
 * MessageDeleted Model
 * Tracks messages deleted "for me" by specific users
 * This allows per-user message deletion without affecting other users
 */
const messageDeletedSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: [true, 'Message ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    deletedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate entries and enable fast lookups
messageDeletedSchema.index({ messageId: 1, userId: 1 }, { unique: true });
// Index for getting all deleted messages for a user in a conversation
messageDeletedSchema.index({ conversationId: 1, userId: 1, deletedAt: -1 });

module.exports = mongoose.model('MessageDeleted', messageDeletedSchema);

