const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken, checkRole } = require('../middleware/auth');
const leaveController = require('../controllers/leave.controller');

router.get('/allocations/me', verifyToken, leaveController.getMyAllocations);
router.post('/request', verifyToken, upload.single('attachment'), leaveController.requestLeave);
router.get('/all', verifyToken, checkRole('Admin'), leaveController.getAllLeaves);
router.patch('/:id/process', verifyToken, checkRole('Admin'), leaveController.processLeave);

module.exports = router;
