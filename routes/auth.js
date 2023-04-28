const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');
const {
  uploadSingleImage
} = require('../middleware/uploadImageMiddleWare')

const {
  register,
  login,
  getUserByID,
  forgetPassword,
  verifyResetCode,
  resetPassword,
  registerAsAdmin,
  registerAsManager,
  allowTo,
  getAllImages
} = require('../controller/auth');

const {
  registerValidator,
  getUserValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
  registerAsAdminValidator,
  registerAsManagerValidator
} = require('../utils/validators/authValidator')

router.post('/registerAsAdmin', registerAsAdminValidator, registerAsAdmin);
router.post('/registerAsManager', registerAsManagerValidator, registerAsManager);
router.post('/register', uploadSingleImage('image', 'image'), registerValidator, register);
router.post('/login', login);
router.get('/getUserId/:id', authMiddleWare, allowTo('manager'),getUserValidator, getUserByID);

router.post('/forgetPassword', forgetPasswordValidator, forgetPassword);
router.post('/verifyResetCode', verifyResetCodeValidator, verifyResetCode);
router.post('/resetPassword', resetPasswordValidator, resetPassword);

router.get('/images', authMiddleWare, allowTo('manager'), getAllImages);

module.exports = router;