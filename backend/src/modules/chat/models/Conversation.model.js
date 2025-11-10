const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      required: [true, 'Conversation type is required'],
      index: true,
    },
    // Group chat specific fields
    name: {
      type: String,
      maxlength: [100, 'Group name cannot exceed 100 characters'],
      trim: true,
      default: null,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true,
      default: null,
    },
    avatar: {
      type: String,
      default: null, // Group avatar URL
    },
    // Owner of the conversation (for group chats)
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Last message reference
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
    // Total message count
    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Encryption settings
    encryptionEnabled: {
      type: Boolean,
      default: true,
    },
    // Conversation-level encryption key (encrypted separately for each participant)
    conversationKey: {
      type: String,
      default: null, // AES-256 key encrypted with owner's public key
    },
    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
conversationSchema.index({ type: 1, lastMessageAt: -1 });
conversationSchema.index({ ownerId: 1, isActive: 1 });

// Virtual to populate participants count
conversationSchema.virtual('participantsCount', {
  ref: 'Participant',
  localField: '_id',
  foreignField: 'conversationId',
  count: true,
  match: { isActive: true },
});

// Method to check if conversation is archived
conversationSchema.methods.isArchived = function() {
  return this.archivedAt !== null;
};

// Pre-save hook to update lastMessageAt
conversationSchema.pre('save', function(next) {
  if (this.isModified('lastMessage') && this.lastMessage) {
    this.lastMessageAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);

