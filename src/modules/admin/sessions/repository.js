const pool = require('../../../config/db');

exports.getSessions = async ({ type, search, status, page, limit }) => {
  const offset = (page - 1) * limit;

  if (type === 'chat') {
    let where = 'WHERE 1=1';
    const params = [];
    if (search) {
      where += ' AND (u.name LIKE ? OR a.name LIKE ? OR cc.id LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (status && status !== 'all') { where += ' AND cc.status = ?'; params.push(status); }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM chat_conversations cc
       JOIN users u ON u.id = cc.user_id
       JOIN astrologers a ON a.id = cc.astrologer_id ${where}`, params
    );

    const [rows] = await pool.query(`
      SELECT cc.id, CONCAT('SES-CHAT-', cc.id) AS session_id,
        u.name AS user_name, u.mobile AS user_phone,
        a.name AS astrologer_name, a.expertise AS astrologer_specialization,
        'chat' AS type,
        cc.started_at AS start_time, cc.ended_at AS end_time,
        cc.duration, cc.amount, cc.charge_per_min,
        ROUND(cc.amount * cc.admin_commission / 100, 2) AS platform_fee,
        ROUND(cc.amount * (100 - cc.admin_commission) / 100, 2) AS astrologer_earning,
        cc.status, cc.disconnect_reason,
        cc.user_rating, cc.user_review, cc.total_messages,
        cc.created_at
      FROM chat_conversations cc
      JOIN users u ON u.id = cc.user_id
      JOIN astrologers a ON a.id = cc.astrologer_id
      ${where} ORDER BY cc.created_at DESC LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    return { total, data: rows };
  }

  // call_type: audio | video
  const callType = type === 'audio' ? 'audio' : 'video';
  let where = 'WHERE ch.call_type = ?';
  const params = [callType];

  if (search) {
    where += ' AND (u.name LIKE ? OR a.name LIKE ? OR ch.id LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  if (status && status !== 'all') { where += ' AND ch.status = ?'; params.push(status); }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM call_history ch
     JOIN users u ON u.id = ch.user_id
     JOIN astrologers a ON a.id = ch.agent_id ${where}`, params
  );

  const [rows] = await pool.query(`
    SELECT ch.id, CONCAT('SES-CALL-', ch.id) AS session_id,
      u.name AS user_name, u.mobile AS user_phone,
      a.name AS astrologer_name, a.expertise AS astrologer_specialization,
      ch.call_type AS type,
      ch.created_at AS start_time,
      ch.duration, ch.amount, ch.per_minute_charge AS charge_per_min,
      ROUND(ch.amount * ch.admin_commission_percent / 100, 2) AS platform_fee,
      ROUND(ch.amount * (100 - ch.admin_commission_percent) / 100, 2) AS astrologer_earning,
      ch.status, ch.disconnect_reason,
      ch.user_rating, ch.user_review,
      ch.recording_url, ch.created_at
    FROM call_history ch
    JOIN users u ON u.id = ch.user_id
    JOIN astrologers a ON a.id = ch.agent_id
    ${where} ORDER BY ch.created_at DESC LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  return { total, data: rows };
};

exports.getById = async ({ type, id }) => {
  if (type === 'chat') {
    const [[row]] = await pool.query(`
      SELECT cc.*,
        CONCAT('SES-CHAT-', cc.id) AS session_id, 'chat' AS type,
        cc.started_at AS start_time, cc.ended_at AS end_time,
        cc.charge_per_min,
        ROUND(cc.amount * cc.admin_commission / 100, 2)         AS platform_fee,
        ROUND(cc.amount * (100 - cc.admin_commission) / 100, 2) AS astrologer_earning,
        u.name AS user_name, u.mobile AS user_phone, u.email AS user_email,
        COALESCE(w.balance, 0) AS user_wallet, u.created_at AS user_joined,
        a.name AS astrologer_name, a.phone AS astrologer_phone,
        a.rating AS astrologer_rating, a.expertise AS astrologer_specialization
      FROM chat_conversations cc
      JOIN users u       ON u.id = cc.user_id
      JOIN astrologers a ON a.id = cc.astrologer_id
      LEFT JOIN wallet w ON w.user_id = u.id
      WHERE cc.id = ?
    `, [id]);
    if (!row) return null;

    const [chatMessages] = await pool.query(`
      SELECT
        CASE WHEN sender_type = 'user' THEN 'user' ELSE 'astro' END AS \`from\`,
        message AS text,
        DATE_FORMAT(sent_at, '%h:%i %p') AS time
      FROM chat_messages
      WHERE conversation_id = ?
      ORDER BY sent_at ASC
    `, [row.conversation_id || row.uuid]);

    return { ...row, chatMessages, callTimeline: null };
  }

  // audio | video
  const [[row]] = await pool.query(`
    SELECT ch.*,
      CONCAT('SES-CALL-', ch.id) AS session_id,
      ch.call_type AS type,
      ch.created_at AS start_time,
      ch.per_minute_charge AS charge_per_min,
      ROUND(ch.amount * ch.admin_commission_percent / 100, 2)         AS platform_fee,
      ROUND(ch.amount * (100 - ch.admin_commission_percent) / 100, 2) AS astrologer_earning,
      u.name AS user_name, u.mobile AS user_phone, u.email AS user_email,
      COALESCE(w.balance, 0) AS user_wallet, u.created_at AS user_joined,
      a.name AS astrologer_name, a.phone AS astrologer_phone,
      a.rating AS astrologer_rating, a.expertise AS astrologer_specialization
    FROM call_history ch
    JOIN users u       ON u.id = ch.user_id
    JOIN astrologers a ON a.id = ch.agent_id
    LEFT JOIN wallet w ON w.user_id = u.id
    WHERE ch.id = ?
  `, [id]);
  if (!row) return null;

  const callTimeline = [
    { time: row.start_time,                    event: 'Call initiated by user',                              type: 'info'    },
    { time: row.start_time,                    event: 'Call connected',                                      type: 'success' },
    { time: row.end_time || row.created_at,    event: `Call ended — ${row.disconnect_reason || 'Completed'}`,type: 'info'    },
    { time: row.end_time || row.created_at,    event: `Amount deducted: ₹${row.amount}`,                    type: 'success' },
    { time: row.end_time || row.created_at,    event: `Astrologer credited: ₹${row.astrologer_earning}`,    type: 'success' },
  ];

  return { ...row, chatMessages: null, callTimeline };
};

exports.getStats = async () => {
  const [[chat]] = await pool.query(`
    SELECT COUNT(*) AS total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
      COALESCE(SUM(duration), 0) AS total_minutes,
      COALESCE(SUM(amount), 0) AS total_revenue
    FROM chat_conversations
  `);

  const [[call]] = await pool.query(`
    SELECT
      SUM(CASE WHEN call_type='audio' THEN 1 ELSE 0 END) AS audio_total,
      SUM(CASE WHEN call_type='video' THEN 1 ELSE 0 END) AS video_total,
      SUM(CASE WHEN call_type='audio' AND status='completed' THEN 1 ELSE 0 END) AS audio_completed,
      SUM(CASE WHEN call_type='video' AND status='completed' THEN 1 ELSE 0 END) AS video_completed,
      COALESCE(SUM(CASE WHEN call_type='audio' THEN duration ELSE 0 END), 0) AS audio_minutes,
      COALESCE(SUM(CASE WHEN call_type='video' THEN duration ELSE 0 END), 0) AS video_minutes,
      COALESCE(SUM(CASE WHEN call_type='audio' THEN amount ELSE 0 END), 0) AS audio_revenue,
      COALESCE(SUM(CASE WHEN call_type='video' THEN amount ELSE 0 END), 0) AS video_revenue
    FROM call_history
  `);

  return { chat, call };
};
