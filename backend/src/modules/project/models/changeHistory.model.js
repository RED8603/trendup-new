const mongoose = require('mongoose');

const changeHistorySchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'Project ID is required'],
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        changeType: {
            type: String,
            enum: [
                'create',
                'update',
                'delete',
                'restore',
                'publish',
                'unpublish',
                'document_add',
                'document_remove',
                'module_toggle',
                'team_add',
                'team_remove',
                'team_update',
                'verification',
                'ownership_transfer',
            ],
            required: [true, 'Change type is required'],
        },
        fieldChanged: {
            type: String,
            trim: true,
        },
        oldValue: {
            type: mongoose.Schema.Types.Mixed,
        },
        newValue: {
            type: mongoose.Schema.Types.Mixed,
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        // Audit trail info
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        // Additional metadata
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.__v;
                // Mask IP address for privacy (show last part only)
                if (ret.ipAddress) {
                    const parts = ret.ipAddress.split('.');
                    if (parts.length === 4) {
                        ret.ipAddress = `***.***.***.${parts[3]}`;
                    }
                }
                return ret;
            },
        },
        toObject: { virtuals: true },
    }
);

// Indexes for efficient querying
changeHistorySchema.index({ projectId: 1, createdAt: -1 });
changeHistorySchema.index({ userId: 1, createdAt: -1 });
changeHistorySchema.index({ changeType: 1 });

// Virtual for user details
changeHistorySchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});

// Static method to log a change
changeHistorySchema.statics.logChange = async function (data) {
    const { projectId, userId, changeType, fieldChanged, oldValue, newValue, description, ipAddress, userAgent, metadata } = data;

    const changeRecord = new this({
        projectId,
        userId,
        changeType,
        fieldChanged,
        oldValue,
        newValue,
        description,
        ipAddress,
        userAgent,
        metadata,
    });

    return changeRecord.save();
};

// Static method to get history for a project
changeHistorySchema.statics.getProjectHistory = async function (projectId, options = {}) {
    const { page = 1, limit = 20, changeType } = options;

    const query = { projectId };
    if (changeType) {
        query.changeType = changeType;
    }

    const total = await this.countDocuments(query);
    const history = await this.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name username avatar');

    return {
        history,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

// Format change for display
changeHistorySchema.methods.formatChange = function () {
    const typeDescriptions = {
        create: 'created the project',
        update: `updated ${this.fieldChanged}`,
        delete: 'deleted the project',
        restore: 'restored the project',
        publish: 'published the project',
        unpublish: 'unpublished the project',
        document_add: 'added a document',
        document_remove: 'removed a document',
        module_toggle: `toggled ${this.fieldChanged} module`,
        team_add: 'added a team member',
        team_remove: 'removed a team member',
        team_update: 'updated team member role',
        verification: 'verified the project',
        ownership_transfer: 'transferred ownership',
    };

    return {
        action: typeDescriptions[this.changeType] || this.description,
        timestamp: this.createdAt,
        before: this.oldValue,
        after: this.newValue,
    };
};

const ChangeHistory = mongoose.model('ChangeHistory', changeHistorySchema);

module.exports = ChangeHistory;
