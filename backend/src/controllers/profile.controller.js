const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

exports.getProfile = async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user.id;
  const companyId = req.user.company_id;

  try {
    const userRes = await db.query('SELECT * FROM users WHERE id = $1 AND company_id = $2', [userId, companyId]);
    if (userRes.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    const profileRes = await db.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    const salaryRes = await db.query('SELECT * FROM salary_structures WHERE user_id = $1', [userId]);

    res.json({
      user: userRes.rows[0],
      profile: profileRes.rows[0] || {},
      salary: (req.user.role === 'Admin' || requesterId === userId) ? salaryRes.rows[0] : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  const companyId = req.user.company_id;
  const requesterId = req.user.id;
  const role = req.user.role;

  try {
    const userRes = await db.query('SELECT id FROM users WHERE id = $1 AND company_id = $2', [userId, companyId]);
    if (userRes.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    if (requesterId != userId && role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { job_title, department, manager, location, date_of_birth, nationality, personal_email, bank_account_number, bank_name, ifsc_code, skills, hobbies, certifications, joined_date } = req.body;
    const { phone, address, full_name } = req.body;

    await db.query(
      'INSERT INTO profiles (user_id, job_title, department, manager, location, date_of_birth, nationality, personal_email, bank_account_number, bank_name, ifsc_code, skills, hobbies, certifications, joined_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT (user_id) DO UPDATE SET job_title=$2, department=$3, manager=$4, location=$5, date_of_birth=$6, nationality=$7, personal_email=$8, bank_account_number=$9, bank_name=$10, ifsc_code=$11, skills=$12, hobbies=$13, certifications=$14, joined_date=$15, updated_at=NOW()',
      [userId, job_title, department, manager, location, date_of_birth, nationality, personal_email, bank_account_number, bank_name, ifsc_code, skills, hobbies, certifications, joined_date]
    );

    if (role === 'Admin' || requesterId === userId) {
      await db.query('UPDATE users SET phone = $1, address = $2, full_name = $3 WHERE id = $4', [phone, address, full_name, userId]);
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateAvatar = async (req, res) => {
  const { userId } = req.params;
  const companyId = req.user.company_id;
  
  try {
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    await db.query('UPDATE users SET profile_pic = $1 WHERE id = $2 AND company_id = $3', [randomAvatar, userId, companyId]);
    res.json({ profile_pic: randomAvatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
