const db = require('../config/db');

exports.getMyAllocations = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query('SELECT * FROM leave_allocations WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.requestLeave = async (req, res) => {
  const userId = req.user.id;
  const { leave_type, start_date, end_date, remarks } = req.body;
  const attachment_url = req.file ? req.file.path : null;

  if (leave_type === 'Sick' && !req.file) return res.status(400).json({ error: 'Attachment required for sick leave' });

  try {
    const days = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24) + 1;
    
    const overlap = await db.query(
      'SELECT id FROM leaves WHERE user_id = $1 AND status IN (\'Pending\', \'Approved\') AND (start_date <= $3 AND end_date >= $2)',
      [userId, start_date, end_date]
    );
    if (overlap.rowCount > 0) return res.status(400).json({ error: 'Dates overlap with existing request' });

    if (leave_type !== 'Unpaid') {
      const alloc = await db.query('SELECT balance FROM leave_allocations WHERE user_id = $1 AND leave_type = $2', [userId, leave_type]);
      if (alloc.rowCount === 0 || alloc.rows[0].balance < days) return res.status(400).json({ error: 'Insufficient leave balance' });
    }

    await db.query(
      'INSERT INTO leaves (user_id, leave_type, start_date, end_date, days, remarks, attachment_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, leave_type, start_date, end_date, days, remarks, attachment_url]
    );
    res.status(201).json({ message: 'Leave requested' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllLeaves = async (req, res) => {
  const companyId = req.user.company_id;
  try {
    const result = await db.query(
      'SELECT l.*, u.full_name FROM leaves l JOIN users u ON l.user_id = u.id WHERE u.company_id = $1',
      [companyId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.processLeave = async (req, res) => {
  const { id } = req.params;
  const { status, admin_remarks } = req.body;
  const adminId = req.user.id;

  try {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query('SELECT * FROM leaves WHERE id = $1', [id]);
      const leave = res.rows[0];
      if (!leave) return res.status(404).json({ error: 'Leave not found' });
      if (leave.status !== 'Pending') return res.status(400).json({ error: 'Leave already processed' });

      await client.query('UPDATE leaves SET status = $1, admin_remarks = $2, reviewed_by = $3 WHERE id = $4', [status, admin_remarks, adminId, id]);

      if (status === 'Approved') {
        if (leave.leave_type !== 'Unpaid') {
          await client.query('UPDATE leave_allocations SET balance = balance - $1 WHERE user_id = $2 AND leave_type = $3', [leave.days, leave.user_id, leave.leave_type]);
        }
        
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          await client.query('INSERT INTO attendance (user_id, date, status) VALUES ($1, $2, $3) ON CONFLICT (user_id, date) DO UPDATE SET status = $3', [leave.user_id, dateStr, 'Leave']);
        }
      }
      await client.query('COMMIT');
      res.json({ message: `Leave ${status}` });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
