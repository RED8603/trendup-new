const { body, param, query } = require('express-validator');

const uploadDocumentValidation = [
    param('projectId')
        .isMongoId()
        .withMessage('Invalid project ID'),
    body('documentType')
        .notEmpty()
        .withMessage('Document type is required')
        .isIn(['whitepaper', 'audit', 'legal', 'tokenomics', 'pitch_deck', 'other'])
        .withMessage('Invalid document type'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('isPublic')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('isPublic must be true or false'),
];

const documentIdValidation = [
    param('projectId')
        .isMongoId()
        .withMessage('Invalid project ID'),
    param('documentId')
        .isMongoId()
        .withMessage('Invalid document ID'),
];

const getDocumentsValidation = [
    param('projectId')
        .isMongoId()
        .withMessage('Invalid project ID'),
    query('documentType')
        .optional()
        .isIn(['whitepaper', 'audit', 'legal', 'tokenomics', 'pitch_deck', 'other'])
        .withMessage('Invalid document type'),
    query('includeInactive')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('includeInactive must be true or false'),
];

const updateDocumentValidation = [
    param('projectId')
        .isMongoId()
        .withMessage('Invalid project ID'),
    param('documentId')
        .isMongoId()
        .withMessage('Invalid document ID'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('isPublic')
        .optional()
        .isBoolean()
        .withMessage('isPublic must be a boolean'),
];

module.exports = {
    uploadDocumentValidation,
    documentIdValidation,
    getDocumentsValidation,
    updateDocumentValidation,
};
