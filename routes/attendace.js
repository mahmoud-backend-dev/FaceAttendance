const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');

const {
  allowTo
} = require('../controller/auth')

const {
  addAttendValidator,
  getAttendanceValidator
} = require('../utils/validators/attendanceValidator');

const { uploadSingleImage } = require('../middleware/uploadImageMiddleWare');

const {
  addAttendance,
  getAttendanceByDate
} = require('../controller/attendance');

router.post('/', authMiddleWare, allowTo('manager'), uploadSingleImage('image', 'Face'), addAttendValidator,
(req, res,next) => {
  const boundary = 'my-custom-boundary';
  const contentType = `multipart/form-data; boundary=${boundary}`;
  
  // Set the Content-Type header with the specified boundary value
  req.headers['Content-Type'] = contentType;
  console.log(req.headers['Content-Type']);
  next()
  // Process the multipart/form-data request here...
}, addAttendance);
router.get('/', authMiddleWare, allowTo('admin'), getAttendanceValidator, getAttendanceByDate);
module.exports = router;