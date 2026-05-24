const db = require("../../config/db");

exports.getWallet = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM wallet WHERE user_id=?",
    [userId]
  );

  return rows[0];
};

exports.getTransactions = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT * FROM wallet_transactions
    WHERE user_id=?
    ORDER BY id DESC
  `,
    [userId]
  );

  return rows;
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