const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');

const {
  allowTo
} = require('../controller/auth')

const {
  addAttendValidator,
  getAttendanceValidator,
  addFaceValidator
} = require('../utils/validators/attendanceValidator');

const { uploadSingleImage } = require('../middleware/uploadImageMiddleWare');

const {
  addAttendance,
  getAttendanceByDate,
  addFaceAddendance,
  addAttendanceTest
} = require('../controller/attendance');


router.post('/test',  authMiddleWare,
  allowTo('manager'),
  uploadSingleImage('image', 'Face'),
  addAttendanceTest
)
router.post(
  '/',
  authMiddleWare,
  allowTo('manager'),
  addAttendValidator,
  addAttendance)

router.patch('/:id',
  authMiddleWare,
  allowTo('manager'),
  uploadSingleImage('image', 'Face'),
  addFaceValidator,
  addFaceAddendance)

router.get('/', authMiddleWare, allowTo('admin'), getAttendanceValidator, getAttendanceByDate);
module.exports = router;