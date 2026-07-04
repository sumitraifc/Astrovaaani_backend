const db = require("../../config/db");

exports.getWallet = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM wallet WHERE user_id=?",
    [userId]
  );

  return rows[0];
};

// exports.getTransactions = async (userId) => {
//   const [rows] = await db.query(
//     `
//     SELECT * FROM wallet_transactions
//     WHERE user_id=?
//     ORDER BY id DESC
//   `,
//     [userId]
//   );

//   return rows;
// };

exports.getTransactions = async (userId, type, page, limit) => {
  page  = parseInt(page)  || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const [walletRows] = await db.query(
    `SELECT balance FROM wallet WHERE user_id = ?`,
    [userId]
  );
  const balance = walletRows[0]?.balance || 0;

  let where = `WHERE user_id = ?`;
  const params = [userId];

  if (type) {
    where += ` AND type = ?`;
    params.push(type);
  }

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM wallet_transactions ${where}`, params
  );

  const [transactions] = await db.query(
    `SELECT id, user_id, type, amount, reason, status, created_at
     FROM wallet_transactions ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { balance, total, page, limit, transactions };
};

exports.updateBalance = async (userId, amount) => {
  await db.query(
    `
    INSERT INTO wallet (user_id,balance)
    VALUES (?,?)
    ON DUPLICATE KEY UPDATE
    balance = balance + ?
  `,
    [userId, amount, amount]
  );
};

exports.addTransaction = async (data) => {
  await db.query(
    `
    INSERT INTO wallet_transactions
    (user_id,type,amount,reason)
    VALUES (?,?,?,?)
  `,
    [
      data.user_id,
      data.type,
      data.amount,
      data.reason
    ]
  );
};

exports.addCashfreeTransaction = async (data) => {
  console.log('[addCashfreeTransaction] inserting', { payment_ref: data.payment_ref, user_id: data.user_id, amount: data.amount });
  await db.query(
    `
    INSERT INTO wallet_transactions
    (user_id,type,amount,reason,payment_method,payment_ref,status,balance_before,balance_after)
    VALUES (?,?,?,?,?,?,?,?,?)
  `,
    [
      data.user_id,
      data.type,
      data.amount,
      data.reason,
      data.payment_method,
      data.payment_ref,
      data.status,
      data.balance_before,
      data.balance_after
    ]
  );
};

exports.getTransactionByPaymentRef = async (paymentRef) => {
  console.log('[getTransactionByPaymentRef] paymentRef', paymentRef);
  const [rows] = await db.query(
    `SELECT * FROM wallet_transactions WHERE payment_ref = ? LIMIT 1`,
    [paymentRef]
  );
  console.log('[getTransactionByPaymentRef] rows length', rows.length);

  return rows[0];
};

exports.updateTransactionStatus = async (transactionId, status, paymentRef, balanceAfter) => {
  console.log('[updateTransactionStatus] transactionId', transactionId, 'status', status, 'paymentRef', paymentRef, 'balanceAfter', balanceAfter);
  await db.query(
    `
    UPDATE wallet_transactions
    SET status = ?, reference_id = ?, balance_after = ?
    WHERE id = ?
  `,
    [status, paymentRef, balanceAfter, transactionId]
  );
};

exports.finalizeTransaction = async (transactionId, userId, amount, paymentRef) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT * FROM wallet_transactions WHERE id = ? FOR UPDATE`,
      [transactionId]
    );

    const tx = rows[0];
    if (!tx) {
      await conn.rollback();
      return { updated: false, reason: 'not_found' };
    }

    if (tx.status === 'completed') {
      await conn.rollback();
      return { updated: false, reason: 'already_completed' };
    }

    // update wallet balance
    await conn.query(
      `
      INSERT INTO wallet (user_id,balance)
      VALUES (?,?)
      ON DUPLICATE KEY UPDATE
      balance = balance + ?
    `,
      [userId, amount, amount]
    );

    const [walletRows] = await conn.query(
      `SELECT balance FROM wallet WHERE user_id = ?`,
      [userId]
    );

    const balanceAfter = walletRows[0]?.balance || null;

    // mark transaction completed and set reference_id, keep payment_ref intact
    await conn.query(
      `
      UPDATE wallet_transactions
      SET status = ?, reference_id = ?, balance_after = ?
      WHERE id = ?
    `,
      ['completed', paymentRef, balanceAfter, transactionId]
    );

    await conn.commit();

    return { updated: true, balanceAfter };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};