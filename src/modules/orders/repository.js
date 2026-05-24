const db = require("../../config/db");

exports.create = async (data) => {
  const [result] = await db.query(
    `
    INSERT INTO orders
    (
      order_id,
      user_id,
      astrologer_name,
      consultation_type,
      price,
      image,
      status
    )
    VALUES (?,?,?,?,?,?,?)
  `,
    [
      `ORD${Date.now()}`,
      data.user_id,
      data.astrologer_name,
      data.consultation_type,
      data.price,
      data.image,
      data.status
    ]
  );

  const [rows] = await db.query(
    "SELECT * FROM orders WHERE id=?",
    [result.insertId]
  );

  return rows[0];
};

exports.getAll = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM orders WHERE user_id=? ORDER BY id DESC",
    [userId]
  );

  return rows;
};

exports.getById = async (userId, id) => {
  const [rows] = await db.query(
    "SELECT * FROM orders WHERE id=? AND user_id=?",
    [id, userId]
  );

  return rows[0];
};