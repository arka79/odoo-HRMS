const { verifyToken, checkRole } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

const router = require('express').Router();

router.use(verifyToken, checkRole('Admin'));

router.post('/add-employee', adminController.addEmployee);
router.get('/employees', adminController.listEmployees);

module.exports = router;
