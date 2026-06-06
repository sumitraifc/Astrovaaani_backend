const pool = require('../../../config/db');

exports.getAll = async () => {
  const [rows] = await pool.query('SELECT `key`, `value` FROM app_settings');
  return rows.reduce((acc, r) => { acc[r.key] = r.value; return acc; }, {});
};

exports.upsert = async (settings) => {
  for (const [key, value] of Object.entries(settings)) {
    await pool.query(
      'INSERT INTO app_settings (`key`, `value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value` = ?',
      [key, String(value), String(value)]
    );
  }
};
