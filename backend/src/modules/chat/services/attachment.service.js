const s3Service = require('../../../core/services/s3.service');
const { BadRequestError } = require('../../../core/errors/AppError');
const { logger } = require('../../../core/utils/logger');

class AttachmentService {
  constructor() {
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    this.allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    this.allowedAudioTypes = [
      'audio/mp3', 
      'audio/wav', 
      'audio/ogg', 
      'audio/mpeg',
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/m4a',
      'audio/aac'
    ];
    this.allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  }

  /**
   * Validate file before upload
   * @param {Object} file - Multer file object
   * @returns {Object} - { type, isValid }
   */
  validateFile(file) {
    if (!file || !file.buffer) {
      throw new BadRequestError('File is required');
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      const maxSizeMB = this.maxFileSize / 1024 / 1024;
      throw new BadRequestError(
        `File "${file.originalname || 'unknown'}" (${fileSizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB`
      );
    }

    // Determine file type
    // Extract base MIME type (remove codec parameters like ;codecs=opus)
    const baseMimeType = file.mimetype.split(';')[0].trim();
    
    // Helper function to check if MIME type matches allowed types (handles codec parameters)
    const matchesType = (mimeType, allowedTypes) => {
      return allowedTypes.some(allowed => {
        const allowedBase = allowed.split(';')[0].trim();
        // Check exact match or base type match
        return allowed === mimeType || allowedBase === baseMimeType || mimeType.startsWith(allowedBase + ';');
      });
    };
    
    let fileType = 'file';
    if (matchesType(file.mimetype, this.allowedImageTypes)) {
      fileType = 'image';
    } else if (matchesType(file.mimetype, this.allowedVideoTypes)) {
      fileType = 'video';
    } else if (matchesType(file.mimetype, this.allowedAudioTypes)) {
      fileType = 'audio';
    } else if (!matchesType(file.mimetype, this.allowedFileTypes)) {
      throw new BadRequestError(`File type ${file.mimetype} is not allowed`);
    }

    return {
      type: fileType,
      isValid: true,
    };
  }

  /**
   * Upload attachment to S3
   * @param {Buffer} fileBuffer - File buffer
   * @param {String} userId - User ID for folder structure
   * @param {String} originalFilename - Original filename
   * @param {String} mimetype - File MIME type
   * @returns {Object} - { url, key, type, size, filename }
   */
  async uploadAttachment(fileBuffer, userId, originalFilename, mimetype) {
    try {
      // Validate file
      const file = {
        buffer: fileBuffer,
        size: fileBuffer.length,
        mimetype,
        originalname: originalFilename,
      };

      const validation = this.validateFile(file);
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = originalFilename.split('.').pop();
      const filename = `chat-${userId}-${timestamp}-${randomString}.${extension}`;

      // Upload to S3
      const uploadResult = await s3Service.uploadFile(
        fileBuffer,
        'chat',
        filename,
        mimetype
      );

      return {
        url: uploadResult.url,
        key: uploadResult.key,
        type: validation.type,
        size: fileBuffer.length,
        filename: originalFilename,
        mimeType: mimetype,
      };
    } catch (error) {
      logger.error('Attachment upload error:', error);
      throw error;
    }
  }

  /**
   * Delete attachment from S3
   * @param {String} url - Attachment URL
   * @returns {Boolean} - Success status
   */
  async deleteAttachment(url) {
    try {
      return await s3Service.deleteFile(url);
    } catch (error) {
      logger.error('Attachment deletion error:', error);
      // Don't throw - deletion failure shouldn't break the app
      return false;
    }
  }

  /**
   * Get allowed file types
   * @returns {Object} - Allowed types by category
   */
  getAllowedTypes() {
    return {
      images: this.allowedImageTypes,
      videos: this.allowedVideoTypes,
      audio: this.allowedAudioTypes,
      files: this.allowedFileTypes,
      maxSize: this.maxFileSize,
    };
  }
}

module.exports = new AttachmentService();

