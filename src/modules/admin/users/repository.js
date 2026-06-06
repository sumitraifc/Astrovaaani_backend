const pool = require('../../../config/db');

exports.getAll = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1';
  const params = [];
  if (search) { where += ' AND (u.name LIKE ? OR u.mobile LIKE ? OR u.email LIKE ?)'; const s = `%${search}%`; params.push(s, s, s); }
  if (status && status !== 'all') { where += ' AND u.status = ?'; params.push(status); }

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users u ${where}`, params);
  const [rows] = await pool.query(`
    SELECT u.id, u.name, u.email, u.mobile, u.status, u.profile_image, u.created_at,
      COALESCE(w.balance, 0) AS wallet
    FROM users u
    LEFT JOIN wallet w ON w.user_id = u.id
    ${where} ORDER BY u.id DESC LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  return { total, data: rows };
};

exports.getById = async (id) => {
  const [[user]] = await pool.query(`
    SELECT u.*, COALESCE(w.balance,0) AS wallet
    FROM users u LEFT JOIN wallet w ON w.user_id = u.id
    WHERE u.id = ?`, [id]);

  const [sessions] = await pool.query(`
    SELECT cc.id, 'chat' AS type, a.name AS astrologer, cc.duration, cc.amount, cc.status, cc.user_rating, cc.user_review, cc.created_at
    FROM chat_conversations cc JOIN astrologers a ON a.id = cc.astrologer_id
    WHERE cc.user_id = ? ORDER BY cc.created_at DESC LIMIT 20`, [id]);

  const [txns] = await pool.query(`
    SELECT id, type, amount, balance_before, balance_after, reason, status, created_at
    FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`, [id]);

  return { ...user, sessions, transactions: txns };
};

exports.updateStatus = async (id, status) => {
  await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
};

exports.delete = async (id) => {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
};

exports.addWallet = async (id, amount, note) => {
  const [[wallet]] = await pool.query('SELECT balance FROM wallet WHERE user_id = ?', [id]);
  const before = parseFloat(wallet?.balance || 0);
  const after  = before + parseFloat(amount);

  await pool.query('INSERT INTO wallet (user_id, balance) VALUES (?,?) ON DUPLICATE KEY UPDATE balance = ?', [id, after, after]);
  await pool.query(
    'INSERT INTO wallet_transactions (user_id, type, amount, balance_before, balance_after, reason, status) VALUES (?,?,?,?,?,?,?)',
    [id, 'credit', amount, before, after, note || 'Admin credit', 'completed']
  );
};
