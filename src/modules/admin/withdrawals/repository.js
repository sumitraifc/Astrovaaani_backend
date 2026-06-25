const pool = require('../../../config/db');

exports.getList = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1';
  const params = [];

  if (search) {
    where += ' AND (a.name LIKE ? OR a.phone LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s);
  }
  if (status && status !== 'all') {
    where += ' AND w.status = ?';
    params.push(status);
  }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM astrologer_withdrawals w
     JOIN astrologers a ON a.id = w.astrologer_id ${where}`, params
  );

  const [rows] = await pool.query(`
    SELECT w.*, a.name AS astrologer_name, a.phone AS astrologer_phone,
      a.profile_image, a.wallet_balance,
      a.account_number, a.ifsc_code, a.account_holder, a.bank_name, a.upi_id
    FROM astrologer_withdrawals w
    JOIN astrologers a ON a.id = w.astrologer_id
    ${where}
    ORDER BY w.requested_at DESC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  return { total, data: rows };
};

// exports.approve = async (id, adminId, utr) => {
//   const [[w]] = await pool.query('SELECT * FROM astrologer_withdrawals WHERE id = ?', [id]);
//   if (!w) throw new Error('Withdrawal not found');
//   if (w.status !== 'pending') throw new Error('Already processed');

//   await pool.query(
//     `UPDATE astrologer_withdrawals SET status='approved', utr_number=?, processed_at=NOW(), processed_by=? WHERE id=?`,
//     [utr || null, adminId, id]
//   );

//   // Deduct from astrologer wallet
//   await pool.query(
//     `UPDATE astrologers SET wallet_balance = wallet_balance - ? WHERE id = ?`,
//     [w.amount, w.astrologer_id]
//   );

//   // Wallet transaction log
//   const [[astro]] = await pool.query('SELECT wallet_balance FROM astrologers WHERE id=?', [w.astrologer_id]);
//   await pool.query(
//     `INSERT INTO wallet_transactions (astrologer_id, type, amount, balance_before, balance_after, reason, status)
//      VALUES (?, 'debit', ?, ?, ?, 'Withdrawal approved', 'completed')`,
//     [w.astrologer_id, w.amount, astro.wallet_balance + w.amount, astro.wallet_balance]
//   );
// };

exports.approve = async (id, adminId, utr) => {
  const [[w]] = await pool.query(
    'SELECT * FROM astrologer_withdrawals WHERE id = ?',
    [id]
  );

  if (!w) throw new Error('Withdrawal not found');
  if (w.status !== 'pending') throw new Error('Already processed');

  await pool.query(
    `UPDATE astrologer_withdrawals 
     SET status='approved', 
         utr_number=?, 
         processed_at=NOW(), 
         processed_by=? 
     WHERE id=?`,
    [utr || null, adminId, id]
  );

  // OPTIONAL: transaction log (NO wallet change)
  await pool.query(
    `INSERT INTO wallet_transactions 
     (astrologer_id, type, amount, balance_before, balance_after, reason, status)
     VALUES (?, 'debit', ?, NULL, NULL, 'Withdrawal approved', 'completed')`,
    [w.astrologer_id, w.amount]
  );
};

// exports.reject = async (id, adminId, note) => {
//   const [[w]] = await pool.query('SELECT * FROM astrologer_withdrawals WHERE id = ?', [id]);
//   if (!w) throw new Error('Withdrawal not found');
//   if (w.status !== 'pending') throw new Error('Already processed');

//   await pool.query(
//     `UPDATE astrologer_withdrawals SET status='rejected', rejection_note=?, processed_at=NOW(), processed_by=? WHERE id=?`,
//     [note, adminId, id]
//   );
// };

exports.reject = async (id, adminId, note) => {
  await pool.query('START TRANSACTION');

  const [[w]] = await pool.query(
    'SELECT * FROM astrologer_withdrawals WHERE id = ? FOR UPDATE',
    [id]
  );

  if (!w) throw new Error('Withdrawal not found');
  if (w.status !== 'pending') throw new Error('Already processed');

  // get current balance
  const [[astro]] = await pool.query(
    'SELECT wallet_balance FROM astrologers WHERE id = ? FOR UPDATE',
    [w.astrologer_id]
  );

  const balanceBefore = astro.wallet_balance;
  const balanceAfter = balanceBefore + w.amount; // REFUND

  // update wallet
  await pool.query(
    `UPDATE astrologers SET wallet_balance = ? WHERE id = ?`,
    [balanceAfter, w.astrologer_id]
  );

  // update withdrawal status
  await pool.query(
    `UPDATE astrologer_withdrawals 
     SET status='rejected', 
         rejection_note=?, 
         processed_at=NOW(), 
         processed_by=? 
     WHERE id=?`,
    [note, adminId, id]
  );

  // wallet transaction log
  await pool.query(
    `INSERT INTO wallet_transactions 
     (astrologer_id, type, amount, balance_before, balance_after, reason, status)
     VALUES (?, 'credit', ?, ?, ?, 'Withdrawal rejected refund', 'completed')`,
    [w.astrologer_id, w.amount, balanceBefore, balanceAfter]
  );

  await pool.query('COMMIT');
};