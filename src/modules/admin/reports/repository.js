const pool = require('../../../config/db');

exports.getAll = async ({ search, status, reported_by, page, limit }) => {
  page  = parseInt(page)  || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const params = [];

  if (status && status !== 'all')      { where += ' AND r.status = ?';      params.push(status); }
  if (reported_by && reported_by !== 'all') { where += ' AND r.reported_by = ?'; params.push(reported_by); }
  if (search) {
    where += ' AND (ru.name LIKE ? OR ra.name LIKE ? OR r.reason LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM reports r
     LEFT JOIN users       ru ON ru.id = r.reported_user_id
     LEFT JOIN astrologers ra ON ra.id = r.reported_astrologer_id
     ${where}`, params
  );

  const [rows] = await pool.query(
    `SELECT
       r.id, r.reported_by, r.reason, r.description,
       r.status, r.admin_note, r.action_taken, r.created_at,
       -- reporter
       rpu.name  AS reporter_user_name,
       rpa.name  AS reporter_astrologer_name,
       -- reported
       ru.name   AS reported_user_name,  ru.mobile  AS reported_user_phone,
       ra.name   AS reported_astrologer_name, ra.phone AS reported_astrologer_phone
     FROM reports r
     LEFT JOIN users       rpu ON rpu.id = r.reporter_user_id
     LEFT JOIN astrologers rpa ON rpa.id = r.reporter_astrologer_id
     LEFT JOIN users       ru  ON ru.id  = r.reported_user_id
     LEFT JOIN astrologers ra  ON ra.id  = r.reported_astrologer_id
     ${where}
     ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { total, page, limit, data: rows };
};

exports.getById = async (id) => {
  const [[row]] = await pool.query(
    `SELECT
       r.*,
       rpu.name  AS reporter_user_name,  rpu.mobile  AS reporter_user_phone,
       rpa.name  AS reporter_astrologer_name, rpa.phone AS reporter_astrologer_phone,
       ru.name   AS reported_user_name,  ru.mobile   AS reported_user_phone,
       ra.name   AS reported_astrologer_name, ra.phone AS reported_astrologer_phone
     FROM reports r
     LEFT JOIN users       rpu ON rpu.id = r.reporter_user_id
     LEFT JOIN astrologers rpa ON rpa.id = r.reporter_astrologer_id
     LEFT JOIN users       ru  ON ru.id  = r.reported_user_id
     LEFT JOIN astrologers ra  ON ra.id  = r.reported_astrologer_id
     WHERE r.id = ?`, [id]
  );
  return row || null;
};

exports.takeAction = async (id, { status, admin_note, action_taken }) => {
  await pool.query(
    `UPDATE reports SET status = ?, admin_note = ?, action_taken = ?, updated_at = NOW() WHERE id = ?`,
    [status, admin_note || null, action_taken || null, id]
  );
};

exports.getStats = async () => {
  const [[stats]] = await pool.query(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'pending')      AS pending,
      SUM(status = 'reviewed')     AS reviewed,
      SUM(status = 'action_taken') AS action_taken,
      SUM(status = 'ignored')      AS ignored
    FROM reports
  `);
  return stats;
};
