const pool = require('../../../config/db');

// Get admin's bank details + payout history
exports.getProfile = async (adminId) => {
  const [[admin]] = await pool.query(
    `SELECT id, name, email,
      bank_name, bank_account_number, bank_ifsc, bank_holder_name,
      upi_id, preferred_method
     FROM admin_users WHERE id = ?`, [adminId]
  );
  return admin;
};

exports.updateBankDetails = async (adminId, data) => {
  const { bank_name, bank_account_number, bank_ifsc, bank_holder_name, upi_id, preferred_method } = data;
  await pool.query(
    `UPDATE admin_users SET bank_name=?, bank_account_number=?, bank_ifsc=?,
     bank_holder_name=?, upi_id=?, preferred_method=? WHERE id=?`,
    [bank_name, bank_account_number, bank_ifsc, bank_holder_name, upi_id, preferred_method || 'bank', adminId]
  );
};

exports.getPayoutHistory = async (adminId, { page, limit }) => {
  const offset = (page - 1) * limit;
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) AS total FROM admin_payouts WHERE admin_id = ?', [adminId]
  );
  const [rows] = await pool.query(
    `SELECT * FROM admin_payouts WHERE admin_id = ? ORDER BY requested_at DESC LIMIT ? OFFSET ?`,
    [adminId, limit, offset]
  );
  return { total, data: rows };
};

exports.requestPayout = async (adminId, { amount, method, note }) => {
  await pool.query(
    `INSERT INTO admin_payouts (admin_id, amount, method, note, status, requested_at)
     VALUES (?, ?, ?, ?, 'pending', NOW())`,
    [adminId, amount, method, note || null]
  );
};
