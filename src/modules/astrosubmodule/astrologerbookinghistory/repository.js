const db = require("../../../config/db");

/* =========================
   DATE FILTER
========================= */

function buildDateFilter(from, to, column = "created_at") {
  let sql = "";
  const params = [];

  if (from) {
    sql += ` AND DATE(${column}) >= ?`;
    params.push(from);
  }

  if (to) {
    sql += ` AND DATE(${column}) <= ?`;
    params.push(to);
  }

  return { sql, params };
}

/* =========================
   SUMMARY DASHBOARD
========================= */

exports.getSummary = async (astrologerId) => {

  const [callStats] = await db.query(`
    SELECT
      COUNT(*) as total_bookings,
      SUM(status='completed') as total_completed,
      SUM(status='cancelled') as total_cancelled,
      SUM(call_type='audio') as total_audio,
      SUM(call_type='video') as total_video
    FROM call_history
    WHERE agent_id = ?
  `, [astrologerId]);

  const [chatStats] = await db.query(`
    SELECT
      COUNT(*) as total_chat
    FROM chat_conversations
    WHERE astrologer_id = ?
  `, [astrologerId]);

  return {
    total_bookings: callStats[0].total_bookings,
    total_completed: callStats[0].total_completed,
    total_cancelled: callStats[0].total_cancelled,
    total_audio_calls: callStats[0].total_audio,
    total_video_calls: callStats[0].total_video,
    total_chat_sessions: chatStats[0].total_chat
  };
};

/* =========================
   FULL HISTORY
========================= */

exports.getHistory = async (astrologerId, query) => {

  const { type, status, from, to } = query;

  const history = [];

  // CALL HISTORY
  if (!type || type === "audio" || type === "video" || type === "call") {

    const callFilter = buildDateFilter(from, to, "created_at");

    const [calls] = await db.query(`
      SELECT
        c.id,
        c.user_id,
        u.name as user_name,
        c.call_type,
        c.amount,
        c.duration,
        c.status,
        c.created_at
      FROM call_history c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.agent_id = ?
      ${type === "audio" ? "AND c.call_type='audio'" : ""}
      ${type === "video" ? "AND c.call_type='video'" : ""}
      ${status ? "AND c.status=?" : ""}
      ${callFilter.sql}
      ORDER BY c.created_at DESC
    `,
      [
        astrologerId,
        ...(status ? [status] : []),
        ...callFilter.params
      ]
    );

    calls.forEach(row => {
      history.push({
        id: row.id,
        user_name: row.user_name,
        type: row.call_type,
        source: "call",
        amount: Number(row.amount),
        duration: row.duration,
        status: row.status,
        date: row.created_at
      });
    });
  }

  // CHAT HISTORY
  if (!type || type === "chat") {

    const chatFilter = buildDateFilter(from, to, "created_at");

    const [chats] = await db.query(`
      SELECT
        c.id,
        c.user_id,
        u.name as user_name,
        c.amount,
        c.duration,
        c.status,
        c.created_at
      FROM chat_conversations c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.astrologer_id = ?
      ${status ? "AND c.status=?" : ""}
      ${chatFilter.sql}
      ORDER BY c.created_at DESC
    `,
      [
        astrologerId,
        ...(status ? [status] : []),
        ...chatFilter.params
      ]
    );

    chats.forEach(row => {
      history.push({
        id: row.id,
        user_name: row.user_name,
        type: "chat",
        source: "chat",
        amount: Number(row.amount),
        duration: row.duration,
        status: row.status,
        date: row.created_at
      });
    });
  }

  // sort final
  history.sort((a, b) => new Date(b.date) - new Date(a.date));

  return history;
};

/* =========================
   SINGLE BOOKING DETAIL
========================= */

exports.getBookingDetail = async (astrologerId, id, source) => {

  if (source === "chat") {

    const [rows] = await db.query(`
      SELECT
        c.*,
        u.name as user_name,
        u.mobile,
        u.profile_image
      FROM chat_conversations c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
      AND c.astrologer_id = ?
    `, [id, astrologerId]);

    return rows[0];
  }

  const [rows] = await db.query(`
    SELECT
      c.*,
      u.name as user_name,
      u.mobile,
      u.profile_image
    FROM call_history c
    LEFT JOIN users u ON u.id = c.user_id
    WHERE c.id = ?
    AND c.agent_id = ?
  `, [id, astrologerId]);

  return rows[0];
};