const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate } = require('../../auth/middleware/auth.middleware');
const { documentController } = require('../controllers');
const {
    uploadDocumentValidation,
    documentIdValidation,
    getDocumentsValidation,
    updateDocumentValidation,
} = require('../validators');
const { validationResult } = require('express-validator');
const { BadRequestError } = require('../../../core/errors/AppError');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/png',
            'image/gif',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new BadRequestError('Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, GIF'), false);
        }
    },
});

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(e => e.msg).join(', ');
        throw new BadRequestError(messages);
    }
    next();
};

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authenticate(req, res, next);
    }
    next();
};

// ==================== Routes ====================

// Get all documents for a project (public documents visible without auth)
router.get('/:projectId/documents', getDocumentsValidation, validate, optionalAuth, documentController.getDocuments);

// Get single document
router.get('/:projectId/documents/:documentId', documentIdValidation, validate, optionalAuth, documentController.getDocument);

// Upload document (authenticated)
router.post(
    '/:projectId/documents',
    authenticate,
    upload.single('file'),
    uploadDocumentValidation,
    validate,
    documentController.uploadDocument
);

// Update document metadata (authenticated)
router.patch(
    '/:projectId/documents/:documentId',
    authenticate,
    updateDocumentValidation,
    validate,
    documentController.updateDocument
);

// Delete document (authenticated)
router.delete(
    '/:projectId/documents/:documentId',
    authenticate,
    documentIdValidation,
    validate,
    documentController.deleteDocument
);

module.exports = router;
