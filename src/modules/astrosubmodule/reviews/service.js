const db = require("../../../config/db");
const repo = require("./repository");

exports.addReview = async (userId, data) => {
  const {
    astrologer_id,
    rating,
    comment,
    booking_type,
    conversation_id,
    call_id,
    status
  } = data;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const result = await repo.addReview(userId, {
      astrologer_id,
      booking_type,
      rating,
      comment,
      status
    }, connection);

    const [astroRows] = await connection.query(
      `SELECT rating, total_reviews FROM astrologers WHERE id = ? LIMIT 1`,
      [Number(astrologer_id)]
    );

    const currentRating = Number(astroRows[0]?.rating || 0);
    const currentReviews = Number(astroRows[0]?.total_reviews || 0);
    const newReviews = currentReviews + 1;
    const newRating = newReviews > 0
      ? Number(((currentRating * currentReviews + Number(rating || 0)) / newReviews).toFixed(1))
      : Number(rating || 0);

    await connection.query(
      `UPDATE astrologers SET rating = ?, total_reviews = ? WHERE id = ?`,
      [newRating, newReviews, Number(astrologer_id)]
    );

    if (conversation_id) {
      await connection.query(
        `UPDATE chat_conversations
         SET user_rating = ?, user_review = ?
         WHERE conversation_id = ?`,
        [Number(rating || 0), comment || null, conversation_id]
      );
    }

    if (call_id) {
      await connection.query(
        `UPDATE call_history
         SET user_rating = ?, user_review = ?
         WHERE id = ?`,
        [Number(rating || 0), comment || null, Number(call_id)]
      );
    }

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.getReviews = async (astrologerId, query) => {
  return await repo.getReviews(astrologerId, query);
};