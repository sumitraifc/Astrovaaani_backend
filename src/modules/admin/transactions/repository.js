const pool = require('../../../config/db');

exports.getUserTransactions = async ({ search, type, status, page, limit }) => {
  const offset = (page - 1) * limit;
  let where = 'WHERE wt.user_id IS NOT NULL AND wt.astrologer_id IS NULL';
  const params = [];

  if (search) {
    where += ' AND (u.name LIKE ? OR u.mobile LIKE ? OR wt.payment_ref LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  if (type && type !== 'all')   { where += ' AND wt.type = ?';   params.push(type); }
  if (status && status !== 'all') { where += ' AND wt.status = ?'; params.push(status); }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM wallet_transactions wt
     LEFT JOIN users u ON u.id = wt.user_id ${where}`, params
  );

  // const [rows] = await pool.query(`
  //   SELECT wt.id, wt.type, wt.amount, wt.balance_before, wt.balance_after,
  //     wt.reason, wt.payment_method, wt.payment_ref, wt.status, wt.created_at,
  //     u.id AS user_id, u.name, u.mobile AS phone
  //   FROM wallet_transactions wt
  //   LEFT JOIN users u ON u.id = wt.user_id
  //   ${where} ORDER BY wt.created_at DESC LIMIT ? OFFSET ?
  // `, [...params, limit, offset]);
  const [rows] = await pool.query(`
  SELECT 
    wt.*,

    -- Transaction ID for UI
    CONCAT('TXN', wt.id) AS transaction_id,

    -- User Info
    u.id AS user_id,
    u.name AS user_name,
    u.mobile AS user_phone,
    u.email AS user_email,

    -- Extra helpful computed fields
    CASE 
      WHEN wt.type = 'credit' THEN wt.amount
      ELSE 0 
    END AS credit_amount,

    CASE 
      WHEN wt.type = 'debit' THEN wt.amount
      ELSE 0 
    END AS debit_amount,

    -- Net display flag
    CASE 
      WHEN wt.type = 'credit' THEN '+'
      ELSE '-'
    END AS sign

  FROM wallet_transactions wt
  LEFT JOIN users u ON u.id = wt.user_id

  ${where}
  ORDER BY wt.created_at DESC
  LIMIT ? OFFSET ?
`, [...params, limit, offset]);

  return { total, data: rows };
};

exports.getAstrologerTransactions = async ({ search, type, status, page, limit }) => {
  const offset = (page - 1) * limit;
  let where = 'WHERE wt.astrologer_id IS NOT NULL AND wt.user_id IS NULL';
  const params = [];

  if (search) {
    where += ' AND (a.name LIKE ? OR a.phone LIKE ? OR wt.payment_ref LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  if (type && type !== 'all')   { where += ' AND wt.type = ?';   params.push(type); }
  if (status && status !== 'all') { where += ' AND wt.status = ?'; params.push(status); }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM wallet_transactions wt
     LEFT JOIN astrologers a ON a.id = wt.astrologer_id ${where}`, params
  );

  const [rows] = await pool.query(`
    SELECT wt.id, wt.type, wt.amount, wt.balance_before, wt.balance_after,
      wt.reason, wt.payment_method, wt.payment_ref, wt.status, wt.created_at,
      a.id AS astrologer_id, a.name, a.phone
    FROM wallet_transactions wt
    LEFT JOIN astrologers a ON a.id = wt.astrologer_id
    ${where} ORDER BY wt.created_at DESC LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  return { total, data: rows };
};

exports.addUserAmount = async (userId, amount, note) => {
  const [[wallet]] = await pool.query('SELECT balance FROM wallet WHERE user_id = ?', [userId]);
  const before = parseFloat(wallet?.balance || 0);
  const after  = before + parseFloat(amount);
  await pool.query(
    'INSERT INTO wallet (user_id, balance) VALUES (?,?) ON DUPLICATE KEY UPDATE balance = ?',
    [userId, after, after]
  );
  await pool.query(
    'INSERT INTO wallet_transactions (user_id, type, amount, balance_before, balance_after, reason, status) VALUES (?,?,?,?,?,?,?)',
    [userId, 'credit', amount, before, after, note || 'Admin credit', 'completed']
  );
};

exports.addAstrologerAmount = async (astrologerId, amount, note) => {
  const [[wallet]] = await pool.query('SELECT balance FROM wallet WHERE astrologer_id = ?', [astrologerId]);
  const before = parseFloat(wallet?.balance || 0);
  const after  = before + parseFloat(amount);
  await pool.query(
    'INSERT INTO wallet (astrologer_id, balance) VALUES (?,?) ON DUPLICATE KEY UPDATE balance = ?',
    [astrologerId, after, after]
  );
  await pool.query(
    'INSERT INTO wallet_transactions (astrologer_id, type, amount, balance_before, balance_after, reason, status) VALUES (?,?,?,?,?,?,?)',
    [astrologerId, 'credit', amount, before, after, note || 'Admin credit', 'completed']
  );
};
