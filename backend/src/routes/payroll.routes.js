const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const payrollController = require('../controllers/payroll.controller');

router.get('/me', verifyToken, payrollController.getMyPayroll);
router.put('/:userId', verifyToken, checkRole('Admin'), payrollController.setPayroll);

module.exports = router;
