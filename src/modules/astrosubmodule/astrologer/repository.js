const db = require("../../../config/db");

// find astrologer
exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM astrologers WHERE id=?",
    [id]
  );
  return rows[0];
};
exports.findByMobile = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM astrologers WHERE phone =?",
    [id]
  );
  return rows[0];
};

// create draft astrologer (step 1)
exports.create = async (data) => {
  const [result] = await db.query(
    "INSERT INTO astrologers SET ?",
    [data]
  );
  return result.insertId;
};

// update astrologer step data
exports.update = async (id, data) => {
  await db.query(
    "UPDATE astrologers SET ? WHERE id=?",
    [data, id]
  );
};