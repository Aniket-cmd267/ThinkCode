const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Define allowed video MIME types (.mp4 and .mkv)
  // Note: For .mov use 'video/quicktime', for .avi use 'video/x-msvideo'
  const allowedVideoTypes = [
    'video/mp4',
    'video/x-matroska',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv'
  ];

  if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the video file
  } else {
    cb(new Error('Only video files (.mp4, .mkv, .webm, .mov, .avi, .wmv) are allowed!'), false); // Reject the file
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  // Increased limit to 50MB since video uploads easily exceed 5MB
  limits: { fileSize: 50 * 1024 * 1024 } 
});

module.exports = upload;