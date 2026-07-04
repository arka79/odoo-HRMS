const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');
const profileController = require('../controllers/profile.controller');

router.use(verifyToken);

router.get('/:userId', profileController.getProfile);
router.put('/:userId', profileController.updateProfile);
router.put('/:userId/avatar', upload.single('avatar'), profileController.updateAvatar);

module.exports = router;
