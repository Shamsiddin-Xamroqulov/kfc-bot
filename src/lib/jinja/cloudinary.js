const cloudinary = require("cloudinary").v2;
const serverConfig = require("../../config.js");
const {CLOUDINARY_CONFIG} = serverConfig;

cloudinary.config({
    cloud_name: CLOUDINARY_CONFIG.CLOUD_NAME,
    api_key: CLOUDINARY_CONFIG.API_KEY,
    api_secret: CLOUDINARY_CONFIG.API_SECRET_KEY
});

module.exports = {cloudinary};