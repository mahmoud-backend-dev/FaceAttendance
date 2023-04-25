const express = require('express');
const router = express.Router();

const {
  uploadSingleImage
} = require('../middleware/uploadImageMiddleWare')

const {
  register,
  login
} = require('../controller/auth');
const {
  registerValidator
} = require('../utils/validators/authValidator')

router.post('/register', uploadSingleImage('image', 'image'), registerValidator, register);
router.post('/login',login);

module.exports = router;