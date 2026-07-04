const db = require('../config/db');

exports.getMyPayroll = async (req, res) => {
  const userId = req.user.id;
  try {
    const res = await db.query('SELECT * FROM salary_structures WHERE user_id = $1', [userId]);
    if (res.rowCount === 0) return res.status(404).json({ error: 'Salary structure not found' });
    res.json(res.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.setPayroll = async (req, res) => {
  const { userId } = req.params;
  const companyId = req.user.company_id;
  const changedBy = req.user.id;
  const updates = req.body;

  try {
    const userRes = await db.query('SELECT id FROM users WHERE id = $1 AND company_id = $2', [userId, companyId]);
    if (userRes.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    const oldValRes = await db.query('SELECT * FROM salary_structures WHERE user_id = $1', [userId]);
    const oldVal = oldValRes.rows[0];

    await db.query(
      `INSERT INTO salary_structures (user_id, monthly_wage, working_days_per_week, break_time_hours, basic_pct, hra_pct_of_basic, standard_allowance_pct_of_basic, lta_pct_of_basic, employee_pf_pct, employer_pf_pct, professional_tax) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       ON CONFLICT (user_id) DO UPDATE SET 
       monthly_wage=$2, working_days_per_week=$3, break_time_hours=$4, basic_pct=$5, hra_pct_of_basic=$6, standard_allowance_pct_of_basic=$7, lta_pct_of_basic=$8, employee_pf_pct=$9, employer_pf_pct=$10, professional_tax=$11, updated_at=NOW()`,
      [userId, updates.monthly_wage, updates.working_days_per_week, updates.break_time_hours, updates.basic_pct, updates.hra_pct_of_basic, updates.standard_allowance_pct_of_basic, updates.lta_pct_of_basic, updates.employee_pf_pct, updates.employer_pf_pct, updates.professional_tax]
    );

    await db.query('INSERT INTO salary_audit_log (user_id, changed_by, change_summary) VALUES ($1, $2, $3)', [userId, changedBy, JSON.stringify({ old: oldVal, new: updates })]);

    res.json({ message: 'Salary structure updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
