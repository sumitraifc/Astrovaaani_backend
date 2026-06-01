const db = require("../../../config/db");

exports.addReview = async (userId, data) => {

  const {
    astrologer_id,
    booking_type,
    rating,
    comment,
    status
  } = data;

  const [result] = await db.query(`
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

  const { rating, type, status } = query;

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

  if (rating) {
    sql += ` AND r.rating = ?`;
    params.push(rating);
  }

  if (type) {
    sql += ` AND r.booking_type = ?`;
    params.push(type);
  }

  if (status) {
    sql += ` AND r.status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY r.created_at DESC`;

  const [reviews] = await db.query(sql, params);

  // 🔥 SUMMARY
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
    WHERE astrologer_id = ?
    AND status='published'
  `, [astrologerId]);

  return {
    summary: summary[0],
    reviews
  };
};