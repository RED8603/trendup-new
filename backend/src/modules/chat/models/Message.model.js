const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'file'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true, // Size in bytes
    max: 5 * 1024 * 1024, // 5MB max
  },
  mimeType: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String, // For videos/images
    default: null,
  },
}, { _id: true });

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
      index: true,
    },
    // Encrypted message content (for E2E encryption)
    encryptedContent: {
      type: String,
      required: [true, 'Message content is required'],
    },
    // Original content (for search indexing - encrypted separately)
    contentHash: {
      type: String,
      default: null, // SHA-256 hash for search
    },
    // Message type
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file', 'system'],
      default: 'text',
    },
    // Reply to another message
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    // Attachments
    attachments: [attachmentSchema],
    // Message status
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Pinned message
    isPinned: {
      type: Boolean,
      default: false,
    },
    pinnedAt: {
      type: Date,
      default: null,
    },
    pinnedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Forwarded message
    forwardedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    // Reaction count (denormalized for performance)
    reactionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Read count (denormalized for performance)
    readCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, isPinned: -1, pinnedAt: -1 });
messageSchema.index({ deletedAt: 1 }); // For soft delete queries

// Text index for search (on contentHash - will be populated separately)
messageSchema.index({ contentHash: 'text' });

// Virtual for checking if message is deleted
messageSchema.virtual('isDeleted').get(function() {
  return this.deletedAt !== null;
});

// Method to soft delete message
messageSchema.methods.softDelete = function(userId) {
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

// Method to restore message
messageSchema.methods.restore = function() {
  this.deletedAt = null;
  this.deletedBy = null;
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);

