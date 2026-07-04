const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { verifyToken, checkRole } = require('../middleware/auth');

exports.addEmployee = async (req, res) => {
  const { first_name, last_name, email, phone, role, full_name } = req.body;
  const companyId = req.user.company_id;
  const companyCode = (await db.query('SELECT code FROM companies WHERE id = $1', [companyId])).rows[0].code;

  try {
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rowCount > 0) return res.status(409).json({ error: 'Email already in use' });

    const year = new Date().getFullYear().toString();
    const prefix = companyCode + first_name.slice(0, 2).toUpperCase() + last_name.slice(0, 2).toUpperCase() + year;
    
    const resCount = await db.query(
      'SELECT COUNT(*) FROM users WHERE company_id = $1 AND employee_id LIKE $2',
      [companyId, `${prefix}%`]
    );
    const seq = parseInt(resCount.rows[0].count) + 1;
    const employeeId = `${prefix}${seq.toString().padStart(4, '0')}`;

    const tempPassword = require('../utils/generatePassword')();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const userRes = await db.query(
      'INSERT INTO users (company_id, employee_id, email, password, role, full_name, phone, must_change_password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, employee_id',
      [companyId, employeeId, email, hashedPassword, role || 'Employee', full_name, phone, true]
    );

    res.status(201).json({ 
      user: userRes.rows[0], 
      tempPassword 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.listEmployees = async (req, res) => {
  const { search } = req.query;
  const companyId = req.user.company_id;
  
  try {
    let query = 'SELECT id, employee_id, full_name, email, role FROM users WHERE company_id = $1';
    let params = [companyId];

    if (search) {
      query += ' AND (full_name ILIKE $2 OR employee_id ILIKE $2)';
      params.push(`%${search}%`);
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
