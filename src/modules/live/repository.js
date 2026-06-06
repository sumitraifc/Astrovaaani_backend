const db = require('../../config/db');

/**
 * Live stream record create karo
 */
exports.createLiveStream = async (data) => {
  try {
    console.log("=========== LIVE REPO: createLiveStream ===========");
    console.log("DATA => ", data);

    const sql = `
      INSERT INTO live_streams
      (
        astrologer_id,
        title,
        stream_key,
        status,
        started_at,
        created_at
      )
      VALUES (?, ?, ?, 'live', NOW(), NOW())
    `;

    const [result] = await db.query(sql, [
      data.astrologer_id,
      data.title || "Live Session",
      data.stream_key
    ]);

    console.log("LIVE STREAM CREATED => ", result.insertId);
    return result;

  } catch (error) {
    console.log("LIVE REPO ERROR => ", error);
    throw error;
  }
};

/**
 * Stream fetch by stream_key
 */
exports.getStreamByKey = async (stream_key) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM live_streams WHERE stream_key = ? LIMIT 1`,
      [stream_key]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Stream fetch by id
 */
exports.getStreamById = async (stream_id) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM live_streams WHERE id = ? LIMIT 1`,
      [stream_id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Already live check
 */
exports.getActiveLiveByAstrologer = async (astrologer_id) => {
  try {
    const [rows] = await db.query(
      `SELECT id FROM live_streams
       WHERE astrologer_id = ? AND status = 'live' LIMIT 1`,
      [astrologer_id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};