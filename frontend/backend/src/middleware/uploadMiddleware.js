const multer = require('multer');

// Configure multer to store files in RAM memory as a Buffer instead of writing to local disk
const storage = multer.memoryStorage();

// Optional filter to ensure only image files are accepted
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit max
});

module.exports = upload;