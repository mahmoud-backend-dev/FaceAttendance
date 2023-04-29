const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler');
// Configuration  Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


// Upload to cloudianry
exports.uploadToCloudianry = asyncHandler(async (req, res, next) => {
  let path = req.file.path;
  let data;
  if (req.body.empolyeeId) {
    const ext = req.file.mimetype.split('/')[1];
    const idImage = `${req.body.empolyeeId}.${ext}`
    path = `./uploads/image/${idImage}`
    data = await cloudinary.uploader.upload(path, {
      public_id:req.body.empolyeeId,
      folder: 'FaceAttendanceSystem',
    });
  } else {
    data = await cloudinary.uploader.upload(path, {
      public_id:req.file.originalname,
      folder: 'FaceAttendanceSystem',
    }); 
  }
  req.secure_url = data.secure_url;
  fs.unlinkSync(path);
  next();
});

exports.removeImageFromCloudianry = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
}

