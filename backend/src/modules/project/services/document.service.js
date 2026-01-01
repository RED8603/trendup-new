const { Document, ChangeHistory } = require('../models');
const s3Service = require('../../../core/services/s3.service');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../../../core/errors/AppError');
const { logger } = require('../../../core/utils/logger');
const Project = require('../models/project.model');

class DocumentService {
    /**
     * Upload a document for a project
     */
    async uploadDocument(projectId, userId, file, documentType, options = {}, reqInfo = {}) {
        const { description, isPublic = true, auditInfo } = options;

        // Verify project exists and user has permission
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (!project.canEdit(userId)) {
            throw new ForbiddenError('You do not have permission to upload documents to this project');
        }

        // Validate document type
        const validTypes = ['whitepaper', 'audit', 'legal', 'tokenomics', 'pitch_deck', 'other'];
        if (!validTypes.includes(documentType)) {
            throw new BadRequestError(`Invalid document type. Must be one of: ${validTypes.join(', ')}`);
        }

        // Generate unique filename
        const fileName = s3Service.generateFilename(userId, file.originalname, documentType);

        // Upload to S3
        const uploadResult = await s3Service.uploadFile(
            file.buffer,
            `projects/${projectId}/documents`,
            fileName,
            file.mimetype
        );

        // Get current version for this document type
        const existingDocs = await Document.find({
            projectId,
            documentType,
            isActive: true
        }).sort({ version: -1 });

        const version = existingDocs.length > 0 ? existingDocs[0].version + 1 : 1;

        // Mark previous version as inactive if this is a replacement
        if (existingDocs.length > 0 && documentType !== 'other') {
            await Document.updateMany(
                { projectId, documentType, isActive: true },
                { isActive: false }
            );
        }

        // Create document record
        const document = new Document({
            projectId,
            uploadedBy: userId,
            documentType,
            fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            s3Url: uploadResult.url,
            s3Key: uploadResult.key,
            version,
            description,
            isPublic,
            auditInfo: documentType === 'audit' ? auditInfo : undefined,
        });

        await document.save();

        // Log document upload
        await ChangeHistory.logChange({
            projectId,
            userId,
            changeType: 'document_add',
            description: `Uploaded ${documentType} document: ${file.originalname}`,
            metadata: {
                documentId: document._id,
                documentType,
                fileName: file.originalname,
                version,
            },
            ipAddress: reqInfo.ip,
            userAgent: reqInfo.userAgent,
        });

        logger.info(`Document uploaded: ${document._id} for project ${projectId}`);

        return document;
    }

    /**
     * Get all documents for a project
     */
    async getDocuments(projectId, userId = null, options = {}) {
        const { documentType, includeInactive = false } = options;

        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check if user can view the project
        if (!project.isPublic && !project.canView(userId)) {
            throw new ForbiddenError('You do not have permission to view this project');
        }

        const query = { projectId };

        // Filter by document type if specified
        if (documentType) {
            query.documentType = documentType;
        }

        // Only show active documents unless include inactive is specified
        if (!includeInactive) {
            query.isActive = true;
        }

        // If user is not the owner/team member, only show public documents
        if (!project.canEdit(userId)) {
            query.isPublic = true;
        }

        const documents = await Document.find(query)
            .populate('uploadedBy', 'name username avatar')
            .sort({ documentType: 1, version: -1 });

        return documents;
    }

    /**
     * Get a single document
     */
    async getDocument(documentId, userId = null) {
        const document = await Document.findById(documentId)
            .populate('uploadedBy', 'name username avatar');

        if (!document) {
            throw new NotFoundError('Document not found');
        }

        const project = await Project.findById(document.projectId);

        // Check permissions
        if (!project.isPublic && !project.canView(userId)) {
            throw new ForbiddenError('You do not have permission to view this document');
        }

        // If document is not public, only project members can view
        if (!document.isPublic && !project.canEdit(userId)) {
            throw new ForbiddenError('This document is not publicly available');
        }

        return document;
    }

    /**
     * Delete a document
     */
    async deleteDocument(documentId, userId, reqInfo = {}) {
        const document = await Document.findById(documentId);

        if (!document) {
            throw new NotFoundError('Document not found');
        }

        const project = await Project.findById(document.projectId);

        if (!project.canEdit(userId)) {
            throw new ForbiddenError('You do not have permission to delete this document');
        }

        // Delete from S3
        await s3Service.deleteFile(document.s3Url);

        // Soft delete the document
        document.isDeleted = true;
        document.deletedAt = new Date();
        document.deletedBy = userId;
        document.isActive = false;
        await document.save();

        // Log document deletion
        await ChangeHistory.logChange({
            projectId: document.projectId,
            userId,
            changeType: 'document_remove',
            description: `Deleted document: ${document.originalName}`,
            metadata: {
                documentId: document._id,
                documentType: document.documentType,
                fileName: document.originalName,
            },
            ipAddress: reqInfo.ip,
            userAgent: reqInfo.userAgent,
        });

        logger.info(`Document deleted: ${documentId} by user ${userId}`);

        return { message: 'Document deleted successfully' };
    }

    /**
     * Update document metadata
     */
    async updateDocument(documentId, userId, updates, reqInfo = {}) {
        const document = await Document.findById(documentId);

        if (!document) {
            throw new NotFoundError('Document not found');
        }

        const project = await Project.findById(document.projectId);

        if (!project.canEdit(userId)) {
            throw new ForbiddenError('You do not have permission to update this document');
        }

        const allowedUpdates = ['description', 'isPublic', 'auditInfo'];

        for (const field of allowedUpdates) {
            if (updates[field] !== undefined) {
                document[field] = updates[field];
            }
        }

        await document.save();

        logger.info(`Document updated: ${documentId} by user ${userId}`);

        return document;
    }
}

module.exports = new DocumentService();
