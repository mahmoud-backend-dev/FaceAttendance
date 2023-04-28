const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');

const {
  allowTo
} = require('../controller/auth')

const {
  addAttendValidator,
  getAttendanceValidator,
} = require('../utils/validators/attendanceValidator');

const { uploadSingleImage } = require('../middleware/uploadImageMiddleWare');

const {
  addAttendance,
  getAttendanceByDate,
} = require('../controller/attendance');



router.post(
  '/',
  authMiddleWare,
  allowTo('manager'),
  uploadSingleImage('image', 'Face'),
  addAttendValidator,
  addAttendance
)


router.get('/', authMiddleWare, allowTo('admin'), getAttendanceValidator, getAttendanceByDate);


module.exports = router;