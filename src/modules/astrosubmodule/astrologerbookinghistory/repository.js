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

      SUM(status IN ('answered','hangup')) as total_completed,
      SUM(status IN ('decline','unanswered','disconnect')) as total_cancelled,

      SUM(call_type = 'audio') as total_audio,
      SUM(call_type = 'video') as total_video

    FROM call_history
    WHERE agent_id = ?
  `, [astrologerId]);

  const [chatStats] = await db.query(`
    SELECT COUNT(*) as total_chat
    FROM chat_conversations
    WHERE astrologer_id = ?
      AND status = 'ended'
  `, [astrologerId]);

  return {
    total_bookings: Number(callStats[0].total_bookings || 0),
    total_completed: Number(callStats[0].total_completed || 0),
    total_cancelled: Number(callStats[0].total_cancelled || 0),
    total_audio_calls: Number(callStats[0].total_audio || 0),
    total_video_calls: Number(callStats[0].total_video || 0),
    total_chat_sessions: Number(chatStats[0].total_chat || 0)
  };
};

/* =========================
   FULL HISTORY
========================= */

exports.getHistory = async (astrologerId, query) => {

  const { type, from, to, page, limit } = query;
  const _page   = parseInt(page)  || 1;
  const _limit  = parseInt(limit) || 10;
  const offset  = (_page - 1) * _limit;

  const history = [];

  // =========================
  // CALL HISTORY
  // =========================
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
      ${callFilter.sql}
      ORDER BY c.created_at DESC
    `,
      [astrologerId, ...callFilter.params]
    );

    calls.forEach(row => {
      let finalStatus = "cancelled";
      if (["answered", "hangup"].includes(row.status)) finalStatus = "completed";
      history.push({
        id: row.id,
        user_name: row.user_name,
        type: row.call_type,
        source: "call",
        amount: Number(row.amount || 0),
        duration: Number(row.duration || 0),
        status: finalStatus,
        date: row.created_at
      });
    });
  }

  // =========================
  // CHAT HISTORY
  // =========================
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
      ${chatFilter.sql}
      ORDER BY c.created_at DESC
    `,
      [astrologerId, ...chatFilter.params]
    );

    chats.forEach(row => {
      let finalStatus = "cancelled";
      if (row.status === "ended") finalStatus = "completed";
      history.push({
        id: row.id,
        user_name: row.user_name,
        type: "chat",
        source: "chat",
        amount: Number(row.amount || 0),
        duration: Number(row.duration || 0),
        status: finalStatus,
        date: row.created_at
      });
    });
  }

  history.sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = history.length;
  const paginated = history.slice(offset, offset + _limit);

  return { total, page: _page, limit: _limit, history: paginated };
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