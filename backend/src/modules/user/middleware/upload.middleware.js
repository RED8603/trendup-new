const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { BadRequestError } = require('../../../core/errors/AppError');

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '../../../uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
const coversDir = path.join(uploadsDir, 'covers');

[uploadsDir, avatarsDir, coversDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user._id}-${uniqueSuffix}${ext}`);
  }
});

// Storage configuration for cover images
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, coversDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `cover-${req.user._id}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Avatar upload middleware
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: imageFilter
}).single('avatar');

// Cover image upload middleware
const uploadCover = multer({
  storage: coverStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: imageFilter
}).single('cover');

// Error handling wrapper
const handleMulterError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new BadRequestError('File too large. Maximum size is 5MB for avatars, 10MB for covers'));
        }
        return next(new BadRequestError(err.message));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

module.exports = {
  uploadAvatar: handleMulterError(uploadAvatar),
  uploadCover: handleMulterError(uploadCover),
};

