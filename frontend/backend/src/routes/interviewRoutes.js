const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processResumeValidation } = require('../controllers/interviewController');
const userMiddleware = require('../middleware/userMiddleware'); // Assuming your auth middleware

// Use memory storage for quick parsing without saving to disk
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/upload-resume', userMiddleware, upload.single('resume'), processResumeValidation);

module.exports = router;