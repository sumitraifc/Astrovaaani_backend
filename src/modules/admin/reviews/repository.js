const pool = require('../../../config/db');

exports.getList = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1';
  const params = [];

  if (search) {
    where += ' AND (u.name LIKE ? OR a.name LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s);
  }
  if (status && status !== 'all') {
    where += ' AND r.status = ?';
    params.push(status);
  }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM astrologer_reviews r
     JOIN users u ON u.id = r.user_id
     JOIN astrologers a ON a.id = r.astrologer_id ${where}`, params
  );

  const [rows] = await pool.query(`
    SELECT r.id, r.rating, r.comment, r.booking_type, r.status, r.created_at,
      u.name AS user_name, u.mobile AS user_phone,
      a.name AS astrologer_name, a.profile_image AS astrologer_image
    FROM astrologer_reviews r
    JOIN users u ON u.id = r.user_id
    JOIN astrologers a ON a.id = r.astrologer_id
    ${where}
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  return { total, data: rows };
};

exports.updateStatus = async (id, status) => {
  await pool.query('UPDATE astrologer_reviews SET status = ? WHERE id = ?', [status, id]);
};
