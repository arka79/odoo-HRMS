const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

const generateCompanyCode = async (name) => {
  const words = name.split(' ');
  let code = words.map(w => w[0]).join('').toUpperCase().slice(0, 4);
  if (!code) code = 'CO';

  let finalCode = code;
  let counter = 1;
  while (true) {
    const res = await db.query('SELECT id FROM companies WHERE code = $1', [finalCode]);
    if (res.rowCount === 0) break;
    finalCode = `${code}${++counter}`;
  }
  return finalCode;
};

const generateEmployeeId = async (companyCode, firstName, lastName, year) => {
  const prefix = companyCode + firstName.slice(0, 2).toUpperCase() + lastName.slice(0, 2).toUpperCase() + year;
  const res = await db.query(
    'SELECT COUNT(*) FROM users WHERE company_id = (SELECT id FROM companies WHERE code = $1) AND employee_id LIKE $2',
    [companyCode, `${prefix}%`]
  );
  const seq = parseInt(res.rows[0].count) + 1;
  return `${prefix}${seq.toString().padStart(4, '0')}`;
};

exports.signupCompany = async (req, res) => {
  const { company_name, admin_name, email, phone, password, confirm_password } = req.body;
  const logo = req.file;

  if (password !== confirm_password) return res.status(400).json({ error: 'Passwords do not match' });
  if (!company_name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rowCount > 0) return res.status(409).json({ error: 'Email already in use' });

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const companyCode = await generateCompanyCode(company_name);
      const companyRes = await client.query(
        'INSERT INTO companies (name, code, logo_url) VALUES ($1, $2, $3) RETURNING id',
        [company_name, companyCode, logo ? logo.path : null]
      );
      const companyId = companyRes.rows[0].id;

      const hashedPassword = await bcrypt.hash(password, 10);
      const employeeId = await generateEmployeeId(companyCode, admin_name.split(' ')[0], admin_name.split(' ')[1] || 'XX', new Date().getFullYear().toString());
      
      const userRes = await client.query(
        'INSERT INTO users (company_id, employee_id, email, password, role, full_name, phone, must_change_password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [companyId, employeeId, email, hashedPassword, 'Admin', admin_name, phone, false]
      );
      const userId = userRes.rows[0].id;

      await client.query('COMMIT');

      const token = jwt.sign({ id: userId, employee_id: employeeId, role: 'Admin', company_id: companyId }, SECRET, { expiresIn: '8h' });

      res.status(201).json({
        token,
        company: { id: companyId, name: company_name, code: companyCode },
        admin: { id: userId, employee_id: employeeId, email, full_name: admin_name }
      });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = userRes.rows[0];
    if (user.locked_until && user.locked_until > new Date()) {
      return res.status(403).json({ error: 'Account locked. Try again later.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await db.query('UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1', [user.id]);
      const updated = await db.query('SELECT failed_login_attempts FROM users WHERE id = $1', [user.id]);
      if (updated.rows[0].failed_login_attempts >= 5) {
        await db.query('UPDATE users SET locked_until = NOW() + interval \'15 minutes\', failed_login_attempts = 0 WHERE id = $1', [user.id]);
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await db.query('UPDATE users SET failed_login_attempts = 0 WHERE id = $1', [user.id]);

    const token = jwt.sign({ id: user.id, employee_id: user.employee_id, role: user.role, company_id: user.company_id }, SECRET, { expiresIn: '8h' });
    res.json({ token, must_change_password: user.must_change_password, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'UPDATE users SET password = $1, must_change_password = false WHERE id = $2',
      [hashedPassword, userId]
    );
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
