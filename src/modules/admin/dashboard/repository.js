const pool = require('../../../config/db');

exports.getStats = async () => {
  const [[users]] = await pool.query(`
    SELECT 
      COUNT(*) AS totalUsers,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS activeUsers
    FROM users
  `);

  const [[astros]] = await pool.query(`
    SELECT
      SUM(CASE WHEN approval_status = 'approved' THEN 1 ELSE 0 END) AS totalAstrologers,
      SUM(CASE WHEN approval_status = 'pending'  THEN 1 ELSE 0 END) AS pendingAstrologers
    FROM astrologers
  `);

  const [[refunds]] = await pool.query(`
    SELECT COUNT(*) AS pendingRefunds FROM refunds WHERE status = 'pending'
  `);

  const [[chatStats]] = await pool.query(`
    SELECT
      COALESCE(SUM(amount), 0)    AS chatRevenue,
      COALESCE(SUM(amount * admin_commission / 100), 0) AS chatAdminIncome,
      COUNT(*)                     AS totalChats,
      COALESCE(SUM(duration), 0)  AS chatMinutes
    FROM chat_conversations
     WHERE status IN ('ended', 'active', 'blocked') 
  `);

  // const [[callStats]] = await pool.query(`
  //   SELECT
  //     COALESCE(SUM(amount), 0)   AS callRevenue,
  //     COALESCE(SUM(amount * admin_commission_percent / 100), 0) AS callAdminIncome,
  //     COUNT(*)                    AS totalCalls,
  //     COALESCE(SUM(duration), 0) AS callMinutes
  //   FROM call_history
  //   WHERE status = 'completed'
  // `);

  const [[callStats]] = await pool.query(`
  SELECT
    COALESCE(SUM(amount), 0) AS callRevenue,
    COALESCE(SUM(amount * admin_commission_percent / 100), 0) AS callAdminIncome,
    COUNT(*) AS totalCalls,
    COALESCE(SUM(duration), 0) AS callMinutes,

    -- Audio
    SUM(CASE WHEN call_type='audio' THEN 1 ELSE 0 END) AS totalAudioSessions,
    COALESCE(SUM(CASE WHEN call_type='audio' THEN amount ELSE 0 END),0) AS audioRevenue,

    -- Video
    SUM(CASE WHEN call_type='video' THEN 1 ELSE 0 END) AS totalVideoSessions,
    COALESCE(SUM(CASE WHEN call_type='video' THEN amount ELSE 0 END),0) AS videoRevenue

  FROM call_history
  WHERE status IN ('answered', 'hangup', 'disconnect')
`);
  const totalRevenue = parseFloat(chatStats.chatRevenue) + parseFloat(callStats.callRevenue);
  const adminIncome  = parseFloat(chatStats.chatAdminIncome) + parseFloat(callStats.callAdminIncome);

  const [[todayChat]] = await pool.query(`
    SELECT 
      COALESCE(SUM(amount), 0) AS todayChatRevenue,
      COALESCE(SUM(amount * admin_commission / 100), 0) AS todayChatAdmin
    FROM chat_conversations
    WHERE status IN ('ended', 'active', 'blocked') AND DATE(created_at) = CURDATE()
  `);

  const [[todayCall]] = await pool.query(`
    SELECT 
      COALESCE(SUM(amount), 0) AS todayCallRevenue,
      COALESCE(SUM(amount * admin_commission_percent / 100), 0) AS todayCallAdmin
    FROM call_history
     WHERE status IN ('answered', 'hangup', 'disconnect') AND DATE(created_at) = CURDATE()
  `);

  return {
    totalUsers:       Number(users.totalUsers),
    activeUsers:      Number(users.activeUsers),
    totalAstrologers: Number(astros.totalAstrologers),
    pendingAstrologers: Number(astros.pendingAstrologers),
    pendingRefunds:   Number(refunds.pendingRefunds),
    totalRevenue,
    todayRevenue:     parseFloat(todayChat.todayChatRevenue) + parseFloat(todayCall.todayCallRevenue),
    adminIncome,
    todayAdminIncome: parseFloat(todayChat.todayChatAdmin) + parseFloat(todayCall.todayCallAdmin),
    chatRevenue:      parseFloat(chatStats.chatRevenue),
    chatAdminIncome:  parseFloat(chatStats.chatAdminIncome),
    totalChats:       Number(chatStats.totalChats),
    chatMinutes:      Number(chatStats.chatMinutes),
    callRevenue:      parseFloat(callStats.callRevenue),
    callAdminIncome:  parseFloat(callStats.callAdminIncome),
    totalCalls:       Number(callStats.totalCalls),
    callMinutes:      Number(callStats.callMinutes),
    totalAudioSessions: Number(callStats.totalAudioSessions),
audioRevenue: parseFloat(callStats.audioRevenue),
totalVideoSessions: Number(callStats.totalVideoSessions),
videoRevenue: parseFloat(callStats.videoRevenue),
  };
};

exports.getRevenueChart = async () => {
  const [chatRows] = await pool.query(`
    SELECT 
      DATE_FORMAT(created_at, '%b') AS month,
      MONTH(created_at) AS monthNum,
      YEAR(created_at)  AS year,
      COALESCE(SUM(amount), 0) AS chatTotal,
      COALESCE(SUM(amount * admin_commission / 100), 0) AS chatAdmin
    FROM chat_conversations
    WHERE status IN ('ended', 'active', 'blocked')  AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY year, monthNum, month
    ORDER BY year, monthNum
  `);

  const [callRows] = await pool.query(`
    SELECT 
      DATE_FORMAT(created_at, '%b') AS month,
      MONTH(created_at) AS monthNum,
      YEAR(created_at)  AS year,
      COALESCE(SUM(amount), 0) AS callTotal,
      COALESCE(SUM(amount * admin_commission_percent / 100), 0) AS callAdmin
    FROM call_history
     WHERE status IN ('answered', 'hangup', 'disconnect') AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY year, monthNum, month
    ORDER BY year, monthNum
  `);

  // Merge by month+year
  const map = {};
  chatRows.forEach(r => {
    const key = `${r.year}-${r.monthNum}`;
    map[key] = { month: r.month, total: parseFloat(r.chatTotal), admin: parseFloat(r.chatAdmin) };
  });
  callRows.forEach(r => {
    const key = `${r.year}-${r.monthNum}`;
    if (map[key]) {
      map[key].total += parseFloat(r.callTotal);
      map[key].admin += parseFloat(r.callAdmin);
    } else {
      map[key] = { month: r.month, total: parseFloat(r.callTotal), admin: parseFloat(r.callAdmin) };
    }
  });

  return Object.values(map);
};

exports.getRecentSessions = async () => {
  const [chats] = await pool.query(`
    SELECT 
      u.name AS user, a.name AS astro, 'Chat' AS type,
      cc.duration AS duration, cc.amount,
      ROUND(cc.amount * cc.admin_commission / 100) AS adminCut,
      cc.created_at AS time
    FROM chat_conversations cc
    JOIN users u ON u.id = cc.user_id
    JOIN astrologers a ON a.id = cc.astrologer_id
     WHERE cc.status IN ('ended', 'active', 'blocked') 
    ORDER BY cc.created_at DESC LIMIT 5
  `);

  const [calls] = await pool.query(`
    SELECT
      u.name AS user, a.name AS astro,
      CONCAT(UPPER(ch.call_type)) AS type,
      ch.duration, ch.amount,
      ROUND(ch.amount * ch.admin_commission_percent / 100) AS adminCut,
      ch.created_at AS time
    FROM call_history ch
    JOIN users u ON u.id = ch.user_id
    JOIN astrologers a ON a.id = ch.agent_id
     WHERE ch.status IN ('answered', 'hangup', 'disconnect')
    ORDER BY ch.created_at DESC LIMIT 5
  `);

  return [...chats, ...calls]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);
};
