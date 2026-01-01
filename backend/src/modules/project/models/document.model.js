const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'Project ID is required'],
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Uploader ID is required'],
        },
        documentType: {
            type: String,
            enum: ['whitepaper', 'audit', 'legal', 'tokenomics', 'pitch_deck', 'other'],
            required: [true, 'Document type is required'],
        },
        fileName: {
            type: String,
            required: [true, 'File name is required'],
        },
        originalName: {
            type: String,
            required: [true, 'Original file name is required'],
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        s3Url: {
            type: String,
            required: [true, 'S3 URL is required'],
        },
        s3Key: {
            type: String,
            required: [true, 'S3 key is required'],
        },
        version: {
            type: Number,
            default: 1,
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
        // For audit documents specifically
        auditInfo: {
            auditor: String,
            auditDate: Date,
            score: String,
            findings: {
                critical: { type: Number, default: 0 },
                high: { type: Number, default: 0 },
                medium: { type: Number, default: 0 },
                low: { type: Number, default: 0 },
                informational: { type: Number, default: 0 },
            },
        },
        // Soft delete
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
        toObject: { virtuals: true },
    }
);

// Indexes
documentSchema.index({ projectId: 1, documentType: 1 });
documentSchema.index({ projectId: 1, isActive: 1 });
documentSchema.index({ uploadedBy: 1 });

// Pre-find middleware to exclude deleted documents
documentSchema.pre(/^find/, function (next) {
    if (!this.getQuery().includeDeleted) {
        this.where({ isDeleted: false });
    }
    delete this.getQuery().includeDeleted;
    next();
});

// Format file size for display
documentSchema.virtual('formattedSize').get(function () {
    const bytes = this.size;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
