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

//   const [[callStats]] = await pool.query(`
//   SELECT
//     COALESCE(SUM(amount), 0) AS callRevenue,
//     COALESCE(SUM(amount * admin_commission_percent / 100), 0) AS callAdminIncome,
//     COUNT(*) AS totalCalls,
//     COALESCE(SUM(duration), 0) AS callMinutes,

//     -- Audio
//     SUM(CASE WHEN call_type='audio' THEN 1 ELSE 0 END) AS totalAudioSessions,
//     COALESCE(SUM(CASE WHEN call_type='audio' THEN amount ELSE 0 END),0) AS audioRevenue,

//     -- Video
//     SUM(CASE WHEN call_type='video' THEN 1 ELSE 0 END) AS totalVideoSessions,
//     COALESCE(SUM(CASE WHEN call_type='video' THEN amount ELSE 0 END),0) AS videoRevenue

//   FROM call_history
//   WHERE status IN ('answered', 'hangup', 'disconnect')
// `);
const [[callStats]] = await pool.query(`
  SELECT
    COALESCE(SUM(amount), 0) AS callRevenue,
    COALESCE(SUM(amount * admin_commission_percent / 100), 0) AS callAdminIncome,
    COUNT(*) AS totalCalls,

    -- total minutes (rounded per session)
    SUM(CEIL(duration / 60)) AS callMinutes,

    -- AUDIO
    SUM(CASE WHEN call_type='audio' THEN 1 ELSE 0 END) AS totalAudioSessions,
    COALESCE(SUM(CASE WHEN call_type='audio' THEN amount ELSE 0 END),0) AS audioRevenue,
    COALESCE(SUM(CASE WHEN call_type='audio' THEN amount * admin_commission_percent / 100 ELSE 0 END),0) AS audioAdminIncome,
    COALESCE(SUM(CASE WHEN call_type='audio' THEN CEIL(duration / 60) ELSE 0 END),0) AS audioMinutes,

    -- VIDEO
    SUM(CASE WHEN call_type='video' THEN 1 ELSE 0 END) AS totalVideoSessions,
    COALESCE(SUM(CASE WHEN call_type='video' THEN amount ELSE 0 END),0) AS videoRevenue,
    COALESCE(SUM(CASE WHEN call_type='video' THEN amount * admin_commission_percent / 100 ELSE 0 END),0) AS videoAdminIncome,
    COALESCE(SUM(CASE WHEN call_type='video' THEN CEIL(duration / 60) ELSE 0 END),0) AS videoMinutes

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

  const [[todayChatStats]] = await pool.query(`
  SELECT 
    COUNT(*) AS todayChatSessions,
    COALESCE(SUM(amount), 0) AS todayChatRevenue,
    COALESCE(SUM(amount * admin_commission / 100), 0) AS todayChatAdmin,
    COALESCE(SUM(CEIL(duration / 60)), 0) AS todayChatMinutes
  FROM chat_conversations
  WHERE status IN ('ended','active','blocked')
  AND DATE(created_at) = CURDATE()
`);
const [[todayCallStats]] = await pool.query(`
  SELECT

    -- AUDIO
    SUM(CASE WHEN call_type='audio' THEN 1 ELSE 0 END) AS todayAudioSessions,
    COALESCE(SUM(CASE WHEN call_type='audio' THEN amount ELSE 0 END),0) AS todayAudioRevenue,
    COALESCE(SUM(CASE WHEN call_type='audio' THEN CEIL(duration / 60) ELSE 0 END),0) AS todayAudioMinutes,

    -- VIDEO
    SUM(CASE WHEN call_type='video' THEN 1 ELSE 0 END) AS todayVideoSessions,
    COALESCE(SUM(CASE WHEN call_type='video' THEN amount ELSE 0 END),0) AS todayVideoRevenue,
    COALESCE(SUM(CASE WHEN call_type='video' THEN CEIL(duration / 60) ELSE 0 END),0) AS todayVideoMinutes

  FROM call_history
  WHERE status IN ('answered','hangup','disconnect')
  AND DATE(created_at) = CURDATE()
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
todayChatSessions: Number(todayChatStats.todayChatSessions),
todayChatMinutes: Number(todayChatStats.todayChatMinutes),
todayAudioSessions: Number(todayCallStats.todayAudioSessions),
todayAudioRevenue: parseFloat(todayCallStats.todayAudioRevenue),
todayAudioMinutes: Number(todayCallStats.todayAudioMinutes),
todayVideoSessions: Number(todayCallStats.todayVideoSessions),
todayVideoRevenue: parseFloat(todayCallStats.todayVideoRevenue),
todayVideoMinutes: Number(todayCallStats.todayVideoMinutes),

  //  AUDIO
 
 
  audioAdminIncome: parseFloat(callStats.audioAdminIncome || 0),
  audioMinutes: Number(callStats.audioMinutes || 0),

  //  VIDEO

  videoAdminIncome: parseFloat(callStats.videoAdminIncome || 0),
  videoMinutes: Number(callStats.videoMinutes || 0),
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
        CEIL(ch.duration / 60) AS duration, ch.amount,
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
