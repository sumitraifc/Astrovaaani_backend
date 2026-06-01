const db = require("../../../config/db");

exports.getService = async (astrologerId) => {

  const [rows] = await db.query(`
    SELECT
      id,
      chat_charge,
      audio_charge,
      video_charge
    FROM astrologers
    WHERE id = ?
    LIMIT 1
  `, [astrologerId]);

  return rows[0];
};

exports.updateService = async (astrologerId, data) => {

  const {
    chat_charge,
    audio_charge,
    video_charge
  } = data;

  const [result] = await db.query(`
    UPDATE astrologers
    SET
      chat_charge = ?,
      audio_charge = ?,
      video_charge = ?
    WHERE id = ?
  `, [
    chat_charge,
    audio_charge,
    video_charge,
    astrologerId
  ]);

  return result;
};