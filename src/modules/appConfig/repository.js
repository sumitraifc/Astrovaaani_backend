const db = require("../../config/db");

/**
 * CONTENT APIs
 */
exports.findByType = async (type) => {
  const [rows] = await db.query(
    `SELECT * FROM app_contents
     WHERE type=? AND status='active'
     LIMIT 1`,
    [type]
  );

  return rows[0];
};

/**
 * BANNERS
 */
exports.getBanners = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM banners
    WHERE status='active'
    ORDER BY sort_order ASC
  `);

  return rows;
};