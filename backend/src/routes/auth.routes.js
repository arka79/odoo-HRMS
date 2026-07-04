const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

router.post('/signup-company', upload.single('logo'), authController.signupCompany);
router.post('/login', authController.login);
router.put('/reset-password', verifyToken, authController.resetPassword);

module.exports = router;


