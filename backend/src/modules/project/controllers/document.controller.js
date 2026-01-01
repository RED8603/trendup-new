const { documentService } = require('../services');
const { sendSuccessResponse } = require('../../../core/utils/response');
const ErrorHandler = require('../../../core/errors/ErrorHandler');
const { BadRequestError } = require('../../../core/errors/AppError');

class DocumentController {
    /**
     * Upload document
     * POST /api/v1/projects/:projectId/documents
     */
    async uploadDocument(req, res) {
        const { projectId } = req.params;
        const userId = req.user._id;
        const { documentType, description, isPublic, auditInfo } = req.body;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        if (!req.file) {
            throw new BadRequestError('No file uploaded');
        }

        const document = await documentService.uploadDocument(
            projectId,
            userId,
            req.file,
            documentType,
            { description, isPublic: isPublic === 'true', auditInfo: auditInfo ? JSON.parse(auditInfo) : undefined },
            reqInfo
        );

        sendSuccessResponse(res, 201, 'Document uploaded successfully', { document });
    }

    /**
     * Get all documents for a project
     * GET /api/v1/projects/:projectId/documents
     */
    async getDocuments(req, res) {
        const { projectId } = req.params;
        const userId = req.user?._id;
        const { documentType, includeInactive } = req.query;

        const documents = await documentService.getDocuments(
            projectId,
            userId,
            { documentType, includeInactive: includeInactive === 'true' }
        );

        sendSuccessResponse(res, 200, 'Documents retrieved successfully', { documents });
    }

    /**
     * Get single document
     * GET /api/v1/projects/:projectId/documents/:documentId
     */
    async getDocument(req, res) {
        const { documentId } = req.params;
        const userId = req.user?._id;

        const document = await documentService.getDocument(documentId, userId);

        sendSuccessResponse(res, 200, 'Document retrieved successfully', { document });
    }

    /**
     * Update document metadata
     * PATCH /api/v1/projects/:projectId/documents/:documentId
     */
    async updateDocument(req, res) {
        const { documentId } = req.params;
        const userId = req.user._id;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        const document = await documentService.updateDocument(documentId, userId, req.body, reqInfo);

        sendSuccessResponse(res, 200, 'Document updated successfully', { document });
    }

    /**
     * Delete document
     * DELETE /api/v1/projects/:projectId/documents/:documentId
     */
    async deleteDocument(req, res) {
        const { documentId } = req.params;
        const userId = req.user._id;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        const result = await documentService.deleteDocument(documentId, userId, reqInfo);

        sendSuccessResponse(res, 200, result.message);
    }
}

const documentController = new DocumentController();

module.exports = {
    uploadDocument: ErrorHandler.handleAsync(documentController.uploadDocument.bind(documentController)),
    getDocuments: ErrorHandler.handleAsync(documentController.getDocuments.bind(documentController)),
    getDocument: ErrorHandler.handleAsync(documentController.getDocument.bind(documentController)),
    updateDocument: ErrorHandler.handleAsync(documentController.updateDocument.bind(documentController)),
    deleteDocument: ErrorHandler.handleAsync(documentController.deleteDocument.bind(documentController)),
};
