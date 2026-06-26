const pool = require("../../config/db");

exports.getList = async () => {
  const [rows] = await pool.query(`
    SELECT
      id,
      name,
      amount,
      image
    FROM gift_amounts
    WHERE is_active = 1
    ORDER BY sort_order ASC, id ASC
  `);

  return rows.map((gift) => ({
    ...gift,
    image: gift.image
      ? `${process.env.BASE_URL}/uploads/${gift.image}`
      : null,
  }));
};