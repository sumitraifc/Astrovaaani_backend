const pool = require("../../../config/db");

/**
 * astrologer info
 */
exports.getAstrologer = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, wallet_balance, total_earnings FROM astrologers WHERE id = ?`,
    [id]
  );
  return rows[0];
};

/**
 * charges config
 */
exports.getCharges = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM withdrawal_charges WHERE is_active = 1 LIMIT 1`
  );
  return rows[0];
};

/**
 * update wallet
 */
exports.updateWallet = async (id, balance) => {
  await pool.query(
    `UPDATE astrologers SET wallet_balance = ? WHERE id = ?`,
    [balance, id]
  );
};

/**
 * insert withdrawal
 */
exports.createWithdraw = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO astrologer_withdrawals
    (astrologer_id, amount, method, utr_number, status, requested_at)
    VALUES (?, ?, ?, ?, 'pending', NOW())`,
    [data.astrologer_id, data.amount, data.method, data.utr_number]
  );

  return result;
};

/**
 * withdraw history
 */
exports.getWithdrawHistory = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM astrologer_withdrawals WHERE astrologer_id = ? ORDER BY id DESC`,
    [id]
  );
  return rows;
};

/**
 * earning history (example)
 */
exports.getEarningHistory = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM earnings WHERE astrologer_id = ? ORDER BY id DESC`,
    [id]
  );
  return rows;
};

/**
 * total withdrawn
 */
exports.totalWithdrawn = async (id) => {
  const [rows] = await pool.query(
    `SELECT SUM(amount) as total FROM astrologer_withdrawals WHERE astrologer_id = ? AND status='approved'`,
    [id]
  );
  return rows[0].total || 0;
};

exports.getWithdrawalCharges = async () => {
  const [rows] = await pool.query(`
    SELECT
      tds_percent,
      processing_percent,
      fixed_processing_fee,
      min_withdrawal,
      max_withdrawal,
      suggested_amounts
    FROM withdrawal_charges
    WHERE is_active = 1
    LIMIT 1
  `);

  return rows[0] || null;
};