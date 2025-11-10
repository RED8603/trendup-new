const crypto = require('crypto');
const { BadRequestError } = require('../../../core/errors/AppError');
const { logger } = require('../../../core/utils/logger');

class EncryptionService {
  constructor() {
    // AES-256-GCM encryption settings
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16; // 128 bits
    this.authTagLength = 16; // 128 bits
  }

  /**
   * Generate a random encryption key
   * @returns {Buffer} - Random 256-bit key
   */
  generateKey() {
    return crypto.randomBytes(this.keyLength);
  }

  /**
   * Encrypt message content with AES-256-GCM
   * @param {String} plaintext - Message content to encrypt
   * @param {Buffer} key - Encryption key (32 bytes)
   * @returns {Object} - { encrypted: String, iv: String, authTag: String }
   */
  encryptMessage(plaintext, key) {
    try {
      // Allow empty string for attachment-only messages, but require key
      if (plaintext === null || plaintext === undefined || !key) {
        throw new BadRequestError('Plaintext and key are required');
      }
      
      // If plaintext is empty string, encrypt it anyway (for attachment-only messages)
      const contentToEncrypt = plaintext || '';

      // Generate random IV
      const iv = crypto.randomBytes(this.ivLength);
      
      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      
      // Encrypt
      let encrypted = cipher.update(contentToEncrypt, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get auth tag for authentication
      const authTag = cipher.getAuthTag();
      
      // Return encrypted data as base64 strings for storage
      return {
        encrypted: Buffer.from(encrypted, 'hex').toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
      };
    } catch (error) {
      logger.error('Encryption error:', error);
      throw new BadRequestError('Failed to encrypt message');
    }
  }

  /**
   * Decrypt message content
   * @param {Object} encryptedData - { encrypted: String, iv: String, authTag: String }
   * @param {Buffer} key - Decryption key (32 bytes)
   * @returns {String} - Decrypted plaintext
   */
  decryptMessage(encryptedData, key) {
    try {
      if (!encryptedData || !key) {
        throw new BadRequestError('Encrypted data and key are required');
      }

      const { encrypted, iv, authTag } = encryptedData;

      // Convert from base64 to buffers
      const encryptedBuffer = Buffer.from(encrypted, 'base64');
      const ivBuffer = Buffer.from(iv, 'base64');
      const authTagBuffer = Buffer.from(authTag, 'base64');

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, ivBuffer);
      decipher.setAuthTag(authTagBuffer);

      // Decrypt
      let decrypted = decipher.update(encryptedBuffer, null, 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Decryption error:', error);
      throw new BadRequestError('Failed to decrypt message');
    }
  }

  /**
   * Encrypt a key with another key (for encrypting conversation keys with user keys)
   * This is a simplified version - in production, use RSA or ECDH
   * @param {Buffer} keyToEncrypt - Key to encrypt
   * @param {Buffer} encryptionKey - Key used for encryption
   * @returns {String} - Base64 encoded encrypted key
   */
  encryptKey(keyToEncrypt, encryptionKey) {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, encryptionKey, iv);
      
      let encrypted = cipher.update(keyToEncrypt, null, 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      // Combine IV, authTag, and encrypted data
      const combined = Buffer.concat([
        iv,
        authTag,
        Buffer.from(encrypted, 'hex')
      ]);

      return combined.toString('base64');
    } catch (error) {
      logger.error('Key encryption error:', error);
      throw new BadRequestError('Failed to encrypt key');
    }
  }

  /**
   * Decrypt a key
   * @param {String} encryptedKey - Base64 encoded encrypted key
   * @param {Buffer} decryptionKey - Key used for decryption
   * @returns {Buffer} - Decrypted key
   */
  decryptKey(encryptedKey, decryptionKey) {
    try {
      const combined = Buffer.from(encryptedKey, 'base64');
      
      // Extract IV, authTag, and encrypted data
      const iv = combined.slice(0, this.ivLength);
      const authTag = combined.slice(this.ivLength, this.ivLength + this.authTagLength);
      const encrypted = combined.slice(this.ivLength + this.authTagLength);

      const decipher = crypto.createDecipheriv(this.algorithm, decryptionKey, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, null, null);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted;
    } catch (error) {
      logger.error('Key decryption error:', error);
      throw new BadRequestError('Failed to decrypt key');
    }
  }

  /**
   * Generate a hash for search indexing (one-way hash)
   * @param {String} content - Content to hash
   * @returns {String} - SHA-256 hash
   */
  hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

module.exports = new EncryptionService();

