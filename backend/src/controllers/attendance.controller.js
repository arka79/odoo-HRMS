const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

exports.checkIn = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const existing = await db.query('SELECT id FROM attendance WHERE user_id = $1 AND date = $2', [userId, today]);
    if (existing.rowCount > 0) return res.status(400).json({ error: 'Already checked in today' });

    await db.query('INSERT INTO attendance (user_id, date, check_in, status) VALUES ($1, $2, NOW(), $3)', [userId, today, 'Present']);
    res.json({ message: 'Checked in successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.checkOut = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const res = await db.query('SELECT * FROM attendance WHERE user_id = $1 AND date = $2', [userId, today]);
    if (res.rowCount === 0) return res.status(400).json({ error: 'Not checked in today' });

    const record = res.rows[0];
    if (record.check_out) return res.status(400).json({ error: 'Already checked out' });

    const checkIn = new Date(record.check_in);
    const checkOut = new Date();
    const workHours = (checkOut - checkIn) / (1000 * 60 * 60);

    const salaryRes = await db.query('SELECT working_days_per_week FROM salary_structures WHERE user_id = $1', [userId]);
    const scheduledHours = 8; // Default

    const extraHours = Math.max(0, workHours - scheduledHours);

    await db.query('UPDATE attendance SET check_out = NOW(), work_hours = $1, extra_hours = $2 WHERE id = $3', [workHours, extraHours, record.id]);
    res.json({ message: 'Checked out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMyAttendance = async (req, res) => {
  const userId = req.user.id;
  const { month, year } = req.query;
  try {
    const query = 'SELECT * FROM attendance WHERE user_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3';
    const result = await db.query(query, [userId, month, year]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllAttendance = async (req, res) => {
  const companyId = req.user.company_id;
  const { date } = req.query;
  try {
    const result = await db.query(
      'SELECT a.*, u.full_name FROM attendance a JOIN users u ON a.user_id = u.id WHERE u.company_id = $1 AND a.date = $2',
      [companyId, date]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
