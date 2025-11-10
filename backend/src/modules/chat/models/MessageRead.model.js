const mongoose = require('mongoose');

const messageReadSchema = new mongoose.Schema(
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
    readAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate read receipts
messageReadSchema.index({ messageId: 1, userId: 1 }, { unique: true });
// Index for getting user's read messages in a conversation
messageReadSchema.index({ conversationId: 1, userId: 1, readAt: -1 });

module.exports = mongoose.model('MessageRead', messageReadSchema);

