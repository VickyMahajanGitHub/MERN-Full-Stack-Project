const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
//const multerStorageCloudinary = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//const storage =new multerStorageCloudinary({
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowedFormats: ["jpg", "png", "jpeg"], // supports promises as well
  },
});

module.exports = {
  cloudinary,
  storage,
};

// console.log('Cloudinary Config:', cloudinary.config());
// console.log('Storage:', storage);
// console.log(cloudinary.uploader); // Ensure that this is not undefined.
