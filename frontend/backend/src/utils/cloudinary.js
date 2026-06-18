const cloudinary = require('cloudinary').v2;

// Configure using your specific Cloudinary Dashboard API credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true
},
console.log("Checking Cloudinary Env Keys:", {
            name: process.env.CLOUDINARY_CLOUD_NAME,
            key: process.env.CLOUDINARY_API_KEY ? "EXISTS" : "MISSING",
            secret: process.env.CLOUDINARY_API_SECRET ? "EXISTS" : "MISSING"
        }));

module.exports = cloudinary;