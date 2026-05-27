const db = require("../../config/db");

exports.getAll = async () => {

  const [rows] = await db.query(`
    SELECT
      id,
      name,
      image
    FROM expertise_master
    ORDER BY id ASC
  `);

  return rows;
};