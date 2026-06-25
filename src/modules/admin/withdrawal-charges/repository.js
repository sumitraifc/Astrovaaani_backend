const pool = require('../../../config/db');

exports.get = async () => {
  const [[row]] = await pool.query('SELECT * FROM withdrawal_charges ORDER BY id DESC LIMIT 1');
  return row || null;
};

exports.update = async (data) => {
  const { tds_percent, processing_percent, fixed_processing_fee, is_active,
    min_withdrawal, max_withdrawal, suggested_amounts } = data;

  const suggested = Array.isArray(suggested_amounts)
    ? JSON.stringify(suggested_amounts)
    : suggested_amounts;

  const [[existing]] = await pool.query('SELECT id FROM withdrawal_charges LIMIT 1');
  if (existing) {
    await pool.query(
      `UPDATE withdrawal_charges SET tds_percent=?, processing_percent=?, fixed_processing_fee=?,
       is_active=?, min_withdrawal=?, max_withdrawal=?, suggested_amounts=?, updated_at=NOW()
       WHERE id=?`,
      [tds_percent, processing_percent, fixed_processing_fee, is_active ? 1 : 0,
       min_withdrawal, max_withdrawal, suggested, existing.id]
    );
  } else {
    await pool.query(
      `INSERT INTO withdrawal_charges (tds_percent, processing_percent, fixed_processing_fee,
       is_active, min_withdrawal, max_withdrawal, suggested_amounts)
       VALUES (?,?,?,?,?,?,?)`,
      [tds_percent, processing_percent, fixed_processing_fee, is_active ? 1 : 0,
       min_withdrawal, max_withdrawal, suggested]
    );
  }
};
