const pool = require('../../config/db');

exports.block = async (data) => {
  await pool.query(
    `INSERT IGNORE INTO blocks
     (blocker_type, blocker_user_id, blocker_astrologer_id, blocked_user_id, blocked_astrologer_id)
     VALUES (?,?,?,?,?)`,
    [
      data.blocker_type,
      data.blocker_user_id        || null,
      data.blocker_astrologer_id  || null,
      data.blocked_user_id        || null,
      data.blocked_astrologer_id  || null
    ]
  );
};

exports.unblock = async (data) => {
  await pool.query(
    `DELETE FROM blocks
     WHERE blocker_user_id <=> ?
       AND blocker_astrologer_id <=> ?
       AND blocked_user_id <=> ?
       AND blocked_astrologer_id <=> ?`,
    [
      data.blocker_user_id        || null,
      data.blocker_astrologer_id  || null,
      data.blocked_user_id        || null,
      data.blocked_astrologer_id  || null
    ]
  );
};

exports.isBlocked = async (data) => {
  const [[row]] = await pool.query(
    `SELECT id FROM blocks
     WHERE blocker_user_id <=> ?
       AND blocker_astrologer_id <=> ?
       AND blocked_user_id <=> ?
       AND blocked_astrologer_id <=> ?
     LIMIT 1`,
    [
      data.blocker_user_id        || null,
      data.blocker_astrologer_id  || null,
      data.blocked_user_id        || null,
      data.blocked_astrologer_id  || null
    ]
  );
  return !!row;
};

// User ki blocked astrologers list
exports.getBlockedAstrologers = async (userId, page, limit) => {
  page  = parseInt(page)  || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM blocks WHERE blocker_user_id = ? AND blocked_astrologer_id IS NOT NULL`,
    [userId]
  );
  const [rows] = await pool.query(
    `SELECT b.id, b.created_at,
       a.id AS astrologer_id, a.name, a.profile_image, a.expertise
     FROM blocks b
     JOIN astrologers a ON a.id = b.blocked_astrologer_id
     WHERE b.blocker_user_id = ?
     ORDER BY b.created_at DESC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  return { total, page, limit, data: rows };
};

// Astrologer ki blocked users list
exports.getBlockedUsers = async (astrologerId, page, limit) => {
  page  = parseInt(page)  || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM blocks WHERE blocker_astrologer_id = ? AND blocked_user_id IS NOT NULL`,
    [astrologerId]
  );
  const [rows] = await pool.query(
    `SELECT b.id, b.created_at,
       u.id AS user_id, u.name, u.mobile, u.profile_image
     FROM blocks b
     JOIN users u ON u.id = b.blocked_user_id
     WHERE b.blocker_astrologer_id = ?
     ORDER BY b.created_at DESC LIMIT ? OFFSET ?`,
    [astrologerId, limit, offset]
  );
  return { total, page, limit, data: rows };
};

// Check karo ki koi bhi block hai dono taraf se (chat/call ke liye)
exports.isEitherBlocked = async (userId, astrologerId) => {
  const [[row]] = await pool.query(
    `SELECT id FROM blocks
     WHERE (blocker_user_id = ? AND blocked_astrologer_id = ?)
        OR (blocker_astrologer_id = ? AND blocked_user_id = ?)
     LIMIT 1`,
    [userId, astrologerId, astrologerId, userId]
  );
  return !!row;
};

// Blocked astrologer IDs list (chat/call filter ke liye)
exports.getBlockedAstrologerIds = async (userId) => {
  const [rows] = await pool.query(
    `SELECT blocked_astrologer_id AS id FROM blocks
     WHERE blocker_user_id = ? AND blocked_astrologer_id IS NOT NULL`,
    [userId]
  );
  return rows.map(r => r.id);
};

// Blocked user IDs list (astrologer ke liye)
exports.getBlockedUserIds = async (astrologerId) => {
  const [rows] = await pool.query(
    `SELECT blocked_user_id AS id FROM blocks
     WHERE blocker_astrologer_id = ? AND blocked_user_id IS NOT NULL`,
    [astrologerId]
  );
  return rows.map(r => r.id);
};
