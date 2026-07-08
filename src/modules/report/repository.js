const pool = require('../../config/db');

exports.create = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO reports
     (reported_by, reporter_user_id, reporter_astrologer_id,
      reported_user_id, reported_astrologer_id, reason, description)
     VALUES (?,?,?,?,?,?,?)`,
    [
      data.reported_by,
      data.reporter_user_id       || null,
      data.reporter_astrologer_id || null,
      data.reported_user_id       || null,
      data.reported_astrologer_id || null,
      data.reason,
      data.description            || null
    ]
  );
  return result.insertId;
};

// Check duplicate report
exports.findExisting = async (data) => {
  const [[row]] = await pool.query(
    `SELECT id FROM reports
     WHERE reporter_user_id <=> ?
       AND reporter_astrologer_id <=> ?
       AND reported_user_id <=> ?
       AND reported_astrologer_id <=> ?
     LIMIT 1`,
    [
      data.reporter_user_id       || null,
      data.reporter_astrologer_id || null,
      data.reported_user_id       || null,
      data.reported_astrologer_id || null
    ]
  );
  return row || null;
};

// My reports list
exports.getMyReports = async (reporterUserId, reporterAstrologerId, page, limit) => {
  page  = parseInt(page)  || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const where = reporterUserId
    ? `WHERE r.reporter_user_id = ${pool.escape(reporterUserId)}`
    : `WHERE r.reporter_astrologer_id = ${pool.escape(reporterAstrologerId)}`;

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM reports r ${where}`);

  const [rows] = await pool.query(
    `SELECT r.id, r.reason, r.description, r.status, r.action_taken, r.created_at,
       u.name  AS reported_user_name,
       a.name  AS reported_astrologer_name
     FROM reports r
     LEFT JOIN users       u ON u.id = r.reported_user_id
     LEFT JOIN astrologers a ON a.id = r.reported_astrologer_id
     ${where}
     ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return { total, page, limit, data: rows };
};
