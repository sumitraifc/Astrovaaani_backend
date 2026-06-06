const pool = require('../../../config/db');

exports.getAll = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1';
  const params = [];

  if (search) {
    where += ' AND (u.name LIKE ? OR r.id LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s);
  }
  if (status && status !== 'all') { where += ' AND r.status = ?'; params.push(status); }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM refunds r
     JOIN users u ON u.id = r.user_id ${where}`, params
  );

  const [rows] = await pool.query(`
    SELECT r.id, r.amount, r.reason, r.status, r.rejection_note,
      r.requested_at, r.processed_at,
      r.wallet_transaction_id, r.call_history_id, r.conversation_id,
      u.id AS user_id, u.name AS user_name, u.mobile AS user_phone
    FROM refunds r
    JOIN users u ON u.id = r.user_id
    ${where} ORDER BY r.requested_at DESC LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  return { total, data: rows };
};

exports.approve = async (id, adminId) => {
  const [[refund]] = await pool.query('SELECT * FROM refunds WHERE id = ? AND status = ?', [id, 'pending']);
  if (!refund) throw new Error('Refund not found or already processed');

  // Credit back to user wallet
  const [[wallet]] = await pool.query('SELECT balance FROM wallet WHERE user_id = ?', [refund.user_id]);
  const before = parseFloat(wallet?.balance || 0);
  const after  = before + parseFloat(refund.amount);

  await pool.query(
    'INSERT INTO wallet (user_id, balance) VALUES (?,?) ON DUPLICATE KEY UPDATE balance = ?',
    [refund.user_id, after, after]
  );
  await pool.query(
    'INSERT INTO wallet_transactions (user_id, type, amount, balance_before, balance_after, reason, status) VALUES (?,?,?,?,?,?,?)',
    [refund.user_id, 'refund', refund.amount, before, after, 'Refund approved by admin', 'completed']
  );

  await pool.query(
    'UPDATE refunds SET status = ?, processed_at = NOW(), processed_by = ? WHERE id = ?',
    ['approved', adminId, id]
  );
};

exports.reject = async (id, note, adminId) => {
  const [[refund]] = await pool.query('SELECT id, status FROM refunds WHERE id = ?', [id]);
  if (!refund) throw new Error('Refund not found');
  if (refund.status !== 'pending') throw new Error('Already processed');

  await pool.query(
    'UPDATE refunds SET status = ?, rejection_note = ?, processed_at = NOW(), processed_by = ? WHERE id = ?',
    ['rejected', note, adminId, id]
  );
};
