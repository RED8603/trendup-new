const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        // Basic Info
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            maxlength: [100, 'Project name cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        logo: {
            type: String, // S3 URL
            default: null,
        },
        description: {
            type: String,
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
            trim: true,
        },
        shortDescription: {
            type: String,
            maxlength: [300, 'Short description cannot exceed 300 characters'],
            trim: true,
        },

        // External Links
        links: {
            website: {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        return !v || /^https?:\/\/.+/.test(v);
                    },
                    message: 'Invalid website URL format',
                },
            },
            twitter: {
                type: String,
                trim: true,
            },
            discord: {
                type: String,
                trim: true,
            },
            telegram: {
                type: String,
                trim: true,
            },
            github: {
                type: String,
                trim: true,
            },
            medium: {
                type: String,
                trim: true,
            },
            reddit: {
                type: String,
                trim: true,
            },
        },

        // Contract/Wallet Information
        contractAddress: {
            type: String,
            trim: true,
        },
        blockchain: {
            type: String,
            enum: ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'solana', 'other'],
            default: 'ethereum',
        },
        walletAddress: {
            type: String,
            trim: true,
        },

        // Module Toggles - which sections are enabled for this project
        enabledModules: {
            governance: {
                type: Boolean,
                default: false,
            },
            tokenDetails: {
                type: Boolean,
                default: false,
            },
            claimsRoadmap: {
                type: Boolean,
                default: false,
            },
            audits: {
                type: Boolean,
                default: false,
            },
            treasury: {
                type: Boolean,
                default: false,
            },
            team: {
                type: Boolean,
                default: false,
            },
            whitepaper: {
                type: Boolean,
                default: false,
            },
            socialLinks: {
                type: Boolean,
                default: true,
            },
        },

        // Token Details (if tokenDetails module is enabled)
        tokenInfo: {
            name: String,
            symbol: String,
            totalSupply: String,
            decimals: Number,
            circulatingSupply: String,
        },

        // Team Members
        team: [{
            name: {
                type: String,
                required: true,
            },
            role: String,
            avatar: String,
            twitter: String,
            linkedin: String,
        }],

        // Roadmap (if claimsRoadmap module is enabled)
        roadmap: [{
            quarter: String,
            year: Number,
            title: String,
            description: String,
            status: {
                type: String,
                enum: ['planned', 'in_progress', 'completed'],
                default: 'planned',
            },
        }],

        // Ownership
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner ID is required'],
        },
        teamMembers: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['admin', 'editor', 'viewer'],
                default: 'viewer',
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
        }],

        // Visibility & Status
        isPublic: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
        },

        // Verification
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifiedAt: Date,
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        // Analytics
        viewsCount: {
            type: Number,
            default: 0,
        },
        followersCount: {
            type: Number,
            default: 0,
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

// Indexes for performance
projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ ownerId: 1, createdAt: -1 });
projectSchema.index({ status: 1, isPublic: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ isVerified: 1, status: 1 });

// Text index for search
projectSchema.index({ name: 'text', description: 'text' });

// Virtual for documents
projectSchema.virtual('documents', {
    ref: 'Document',
    localField: '_id',
    foreignField: 'projectId',
});

// Virtual for change history
projectSchema.virtual('changeHistory', {
    ref: 'ChangeHistory',
    localField: '_id',
    foreignField: 'projectId',
});

// Generate slug from name
projectSchema.statics.generateSlug = async function (name) {
    let slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    // Check if slug exists and add number if needed
    let existingProject = await this.findOne({ slug });
    let counter = 1;
    const baseSlug = slug;

    while (existingProject) {
        slug = `${baseSlug}-${counter}`;
        existingProject = await this.findOne({ slug });
        counter++;
    }

    return slug;
};

// Check if user has permission to edit
projectSchema.methods.canEdit = function (userId) {
    if (this.ownerId.toString() === userId.toString()) {
        return true;
    }

    const teamMember = this.teamMembers.find(
        member => member.userId.toString() === userId.toString()
    );

    return teamMember && ['admin', 'editor'].includes(teamMember.role);
};

// Check if user has permission to view (for private projects)
projectSchema.methods.canView = function (userId) {
    if (this.isPublic) return true;
    if (!userId) return false;

    if (this.ownerId.toString() === userId.toString()) {
        return true;
    }

    return this.teamMembers.some(
        member => member.userId.toString() === userId.toString()
    );
};

// Pre-find middleware to exclude deleted projects
projectSchema.pre(/^find/, function (next) {
    if (!this.getQuery().includeDeleted) {
        this.where({ isDeleted: false });
    }
    delete this.getQuery().includeDeleted;
    next();
});

// Increment view count
projectSchema.methods.incrementViews = async function () {
    this.viewsCount += 1;
    await this.save();
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
