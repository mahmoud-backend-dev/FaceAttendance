const express = require('express');
const router = express.Router();

const {
  uploadSingleImage
} = require('../middleware/uploadImageMiddleWare')

const {
  register,
  login,
  getUserByID,
} = require('../controller/auth');
const {
  registerValidator,
  getUserValidator
} = require('../utils/validators/authValidator')

router.post('/register', uploadSingleImage('image', 'image'), registerValidator, register);
router.post('/login', login);
router.get('/getUserId/:id', getUserValidator, getUserByID);

module.exports = router;