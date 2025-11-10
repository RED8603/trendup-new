const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    leftAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Encrypted conversation key for this participant (for E2E encryption)
    encryptedConversationKey: {
      type: String,
      default: null, // Encrypted with user's public key
    },
    // Unread message count for this participant
    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Last message read timestamp
    lastReadAt: {
      type: Date,
      default: null,
    },
    // Mute settings
    muted: {
      type: Boolean,
      default: false,
    },
    mutedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
participantSchema.index({ conversationId: 1, userId: 1 }, { unique: true });
participantSchema.index({ userId: 1, isActive: 1 });

// Virtual for checking if user is muted
participantSchema.virtual('isMuted').get(function() {
  if (!this.muted) return false;
  if (this.mutedUntil && this.mutedUntil < new Date()) {
    this.muted = false;
    this.mutedUntil = null;
    return false;
  }
  return true;
});

module.exports = mongoose.model('Participant', participantSchema);

