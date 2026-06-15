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

exports.getTransactions = async (userId, type) => {

  // 1. WALLET BALANCE
  const [walletRows] = await db.query(
    `SELECT balance FROM wallet WHERE user_id = ?`,
    [userId]
  );

  const balance = walletRows[0]?.balance || 0;

  // 2. TRANSACTIONS
  let query = `
    SELECT 
      id,
      user_id,
      type,
      amount,
      reason,
      created_at
    FROM wallet_transactions
    WHERE user_id=?
  `;

  let params = [userId];

  if (type) {
    query += ` AND type=?`;
    params.push(type);
  }

  query += ` ORDER BY id DESC`;

  const [transactions] = await db.query(query, params);

  return {
    balance,
    transactions
  };
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
    SET status = ?, payment_ref = ?, reference_id = ?, balance_after = ?
    WHERE id = ?
  `,
    [status, paymentRef, paymentRef, balanceAfter, transactionId]
  );
};