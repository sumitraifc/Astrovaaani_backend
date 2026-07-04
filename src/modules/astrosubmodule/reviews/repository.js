const db = require("../../../config/db");

exports.addReview = async (userId, data, connection = db) => {

  const {
    astrologer_id,
    booking_type,
    rating,
    comment,
    status
  } = data;

  const [result] = await connection.query(`
    INSERT INTO astrologer_reviews
    (astrologer_id, user_id, booking_type, rating, comment, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    astrologer_id,
    userId,
    booking_type,
    rating,
    comment,
    status || 'published'
  ]);

  return result;
};

exports.getReviews = async (astrologerId, query) => {

  const { rating, type, status, page, limit } = query;
  const _page  = parseInt(page)  || 1;
  const _limit = parseInt(limit) || 10;
  const offset = (_page - 1) * _limit;

  let sql = `
    SELECT
      r.id,
      r.rating,
      r.comment,
      r.booking_type,
      r.status,
      r.created_at,
      u.name as user_name,
      u.profile_image
    FROM astrologer_reviews r
    LEFT JOIN users u ON u.id = r.user_id
    WHERE r.astrologer_id = ?
  `;

  const params = [astrologerId];

  if (rating) { sql += ` AND r.rating = ?`;       params.push(rating); }
  if (type)   { sql += ` AND r.booking_type = ?`; params.push(type); }
  if (status) { sql += ` AND r.status = ?`;       params.push(status); }

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM astrologer_reviews r WHERE r.astrologer_id = ?${rating ? ' AND r.rating = ?' : ''}${type ? ' AND r.booking_type = ?' : ''}${status ? ' AND r.status = ?' : ''}`,
    params
  );

  sql += ` ORDER BY r.created_at DESC LIMIT ? OFFSET ?`;
  const [reviews] = await db.query(sql, [...params, _limit, offset]);

  const [summary] = await db.query(`
    SELECT
      COUNT(*) as total_reviews,
      ROUND(AVG(rating),1) as average_rating,
      SUM(rating=5) as five_star,
      SUM(rating=4) as four_star,
      SUM(rating=3) as three_star,
      SUM(rating=2) as two_star,
      SUM(rating=1) as one_star
    FROM astrologer_reviews
    WHERE astrologer_id = ? AND status='published'
  `, [astrologerId]);

  return { summary: summary[0], total, page: _page, limit: _limit, reviews };
};