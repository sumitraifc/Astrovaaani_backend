const pool = require('../../../config/db');

exports.findByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM admin_users WHERE email = ? AND status = ?',
    [email, 'active']
  );
    console.log("DB RESULT:", rows);
  return rows[0];
};

exports.updateLastLogin = async (id) => {
  await pool.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [id]);
};

exports.updatePassword = async (id, hashedPassword) => {
  await pool.query('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, id]);
};
