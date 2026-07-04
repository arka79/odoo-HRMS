const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const attendanceController = require('../controllers/attendance.controller');

router.use(verifyToken);

router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/me', attendanceController.getMyAttendance);
router.get('/all', attendanceController.getAllAttendance);

module.exports = router;
