const express = require('express');
const Router = express.Router();

const { getUserProfileData, updateProfilePicture } = require("../controllers/imageUpload");
const upload = require("../middleware/uploadMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

Router.get('/metrics', userMiddleware, getUserProfileData);

// 2. Insert the upload.single middleware. 'profilePicFile' matches the field appended via frontend FormData
Router.post('/update-picture', userMiddleware, upload.single('profilePicFile'), updateProfilePicture);

module.exports = Router;