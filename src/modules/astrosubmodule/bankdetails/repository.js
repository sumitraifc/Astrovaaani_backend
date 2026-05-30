const db = require("../../../config/db");

exports.getByAstrologerId = async (id) => {
  const [rows] = await db.query(
    `SELECT
      account_holder,
      bank_name,
      account_number,
      ifsc_code,
      branch_name,
      upi_id
     FROM astrologers
     WHERE id=?`,
    [id]
  );

  return rows[0];
};

exports.update = async (id, data) => {
  await db.query(
    `UPDATE astrologers SET ? WHERE id=?`,
    [data, id]
  );
};