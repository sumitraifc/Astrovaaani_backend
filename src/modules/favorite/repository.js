const db = require("../../config/db");

/**
 * CHECK FAVORITE EXISTS
 */
exports.checkExists = async (userId, astrologerId) => {
  const [rows] = await db.query(
    `
    SELECT * FROM favorites
    WHERE user_id = ? AND astrologer_id = ?
  `,
    [userId, astrologerId]
  );

  return rows[0];
};

/**
 * ADD FAVORITE
 */
exports.addFavorite = async (userId, astrologerId) => {
  const [result] = await db.query(
    `
    INSERT INTO favorites (user_id, astrologer_id)
    VALUES (?, ?)
  `,
    [userId, astrologerId]
  );

  return result;
};

/**
 * GET FAVORITES
 */
exports.getFavorites = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
      f.id,
      a.id AS astrologer_id,
      a.name,
      a.profile_image,
      a.rating,
      a.chat_charge,
      a.audio_charge,
      a.video_charge,
      a.is_online
    FROM favorites f
    JOIN astrologers a ON a.id = f.astrologer_id
    WHERE f.user_id = ?
    ORDER BY f.id DESC
  `,
    [userId]
  );

  return rows;
};

/**
 * REMOVE FAVORITE
 */
exports.removeFavorite = async (userId, astrologerId) => {
  await db.query(
    `
    DELETE FROM favorites
    WHERE user_id = ? AND astrologer_id = ?
  `,
    [userId, astrologerId]
  );
};