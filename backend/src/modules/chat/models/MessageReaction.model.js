const mongoose = require('mongoose');

const messageReactionSchema = new mongoose.Schema(
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
    emoji: {
      type: String,
      required: [true, 'Emoji is required'],
      maxlength: [10, 'Emoji cannot exceed 10 characters'],
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate reactions (one emoji per user per message)
messageReactionSchema.index({ messageId: 1, userId: 1, emoji: 1 }, { unique: true });
// Index for getting all reactions on a message
messageReactionSchema.index({ messageId: 1, createdAt: -1 });

module.exports = mongoose.model('MessageReaction', messageReactionSchema);

