const pool = require('../../../config/db');

// exports.getAll = async ({ search, status, page, limit }) => {
//   const offset = (page - 1) * limit;
//   let where = 'WHERE 1=1';
//   const params = [];
//   if (search) { where += ' AND (u.name LIKE ? OR u.mobile LIKE ? OR u.email LIKE ?)'; const s = `%${search}%`; params.push(s, s, s); }
//   if (status && status !== 'all') { where += ' AND u.status = ?'; params.push(status); }

//   const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users u ${where}`, params);
//   const [rows] = await pool.query(`
//     SELECT u.id, u.name, u.email, u.mobile, u.status, u.profile_image, u.created_at,
//       COALESCE(w.balance, 0) AS wallet
//     FROM users u
//     LEFT JOIN wallet w ON w.user_id = u.id
//     ${where} ORDER BY u.id DESC LIMIT ? OFFSET ?
//   `, [...params, limit, offset]);

//   return { total, data: rows };
// };

exports.getAll = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;

  let where = "WHERE 1=1";
  const params = [];

  if (search) {
    where +=
      " AND (u.name LIKE ? OR u.mobile LIKE ? OR u.email LIKE ?)";
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  if (status && status !== "all") {
    where += " AND u.status = ?";
    params.push(status);
  }

  // =========================
  // 1. TOTAL COUNT
  // =========================
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM users u ${where}`,
    params
  );

  // =========================
  // 2. MAIN USERS
  // =========================
  const [rows] = await pool.query(
    `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.mobile,
      u.status,
      u.profile_image,
      u.created_at,
      COALESCE(w.balance, 0) AS wallet
    FROM users u
    LEFT JOIN wallet w ON w.user_id = u.id
    ${where}
    ORDER BY u.id DESC
    LIMIT ? OFFSET ?
    `,
    [...params, limit, offset]
  );

  const userIds = rows.map((r) => r.id);

  // =========================
  // 3. SPENT DATA
  // =========================
 const [spentRows] = await pool.query(`
  SELECT 
    u.id,

    -- CHAT
    COALESCE((
      SELECT SUM(amount)
      FROM chat_conversations cc
      WHERE cc.user_id = u.id
      AND cc.status IN ('ended','active','blocked')
    ),0) AS chatSpent,

    -- CALL
    COALESCE((
      SELECT SUM(amount)
      FROM call_history ch
      WHERE ch.user_id = u.id
      AND ch.status IN ('answered','hangup','disconnect')
    ),0) AS callSpent,

    -- GIFTS
    COALESCE((
      SELECT SUM(amount)
      FROM live_gifts lg
      WHERE lg.user_id = u.id
    ),0) AS giftSpent

  FROM users u
  WHERE u.id IN (?)
`, [userIds]);

  // =========================
  // 4. SESSION DATA
  // =========================
  const [sessionRows] = await pool.query(
    `
    SELECT 
      u.id,
      COUNT(DISTINCT cc.id) AS chatSessions,
      COUNT(DISTINCT ch.id) AS callSessions

    FROM users u

    LEFT JOIN chat_conversations cc ON cc.user_id = u.id
    LEFT JOIN call_history ch ON ch.user_id = u.id

    WHERE u.id IN (?)
    GROUP BY u.id
    `,
    [userIds]
  );

  // =========================
  // 5. MAP MERGE
  // =========================
  const spentMap = new Map(spentRows.map((r) => [r.id, r]));
  const sessionMap = new Map(sessionRows.map((r) => [r.id, r]));

  const finalData = rows.map((r) => {
    const spent = spentMap.get(r.id) || {};
    const session = sessionMap.get(r.id) || {};

    return {
      ...r,

      // 🔥 PROFILE IMAGE FIX
      profile_image: r.profile_image
        ? `${process.env.BASE_URL}/uploads/${r.profile_image}`
        : null,

      // 💰 SPENDING
      totalSpent:
        Number(spent.chatSpent || 0) +
        Number(spent.callSpent || 0) +
        Number(spent.giftSpent || 0),

      chatSpent: Number(spent.chatSpent || 0),
      callSpent: Number(spent.callSpent || 0),
      giftSpent: Number(spent.giftSpent || 0),

      // 📊 SESSIONS
      totalSessions:
        Number(session.chatSessions || 0) +
        Number(session.callSessions || 0),

      chatSessions: Number(session.chatSessions || 0),
      callSessions: Number(session.callSessions || 0),
    };
  });

  return { total, data: finalData };
};


// exports.getById = async (id) => {
//   const [[user]] = await pool.query(`
//     SELECT u.*, COALESCE(w.balance,0) AS wallet
//     FROM users u LEFT JOIN wallet w ON w.user_id = u.id
//     WHERE u.id = ?`, [id]);

//   const [sessions] = await pool.query(`
//     SELECT cc.id, 'chat' AS type, a.name AS astrologer, cc.duration, cc.amount, cc.status, cc.user_rating, cc.user_review, cc.created_at
//     FROM chat_conversations cc JOIN astrologers a ON a.id = cc.astrologer_id
//     WHERE cc.user_id = ? ORDER BY cc.created_at DESC LIMIT 20`, [id]);

//   const [txns] = await pool.query(`
//     SELECT id, type, amount, balance_before, balance_after, reason, status, created_at
//     FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`, [id]);

//   return { ...user, sessions, transactions: txns };
// };

exports.getById = async (id) => {

  // =========================
  // 1. USER BASIC INFO
  // =========================
  const [[user]] = await pool.query(`
    SELECT 
      u.*,
      COALESCE(w.balance,0) AS wallet
    FROM users u 
    LEFT JOIN wallet w ON w.user_id = u.id
    WHERE u.id = ?
  `, [id]);

  if (!user) return null;

  // =========================
  // 2. SESSIONS (CHAT + CALL)
  // =========================
  const [sessions] = await pool.query(`
    (
      SELECT 
        cc.id,
        'chat' AS type,
        a.name AS astrologer,
        cc.duration,
        cc.amount,
        cc.status,
        cc.user_rating,
        cc.user_review,
        cc.created_at
      FROM chat_conversations cc
      JOIN astrologers a ON a.id = cc.astrologer_id
      WHERE cc.user_id = ?
    )

    UNION ALL

    (
      SELECT 
        ch.id,
        ch.call_type AS type,
        a.name AS astrologer,
        ch.duration,
        ch.amount,
        ch.status,
        ch.user_rating,
        ch.user_review,
        ch.created_at
      FROM call_history ch
      JOIN astrologers a ON a.id = ch.agent_id
      WHERE ch.user_id = ?
    )

    ORDER BY created_at DESC
    LIMIT 20
  `, [id, id]);

  // =========================
  // 3. WALLET TRANSACTIONS
  // =========================
  const [txns] = await pool.query(`
    SELECT 
      id,
      type,
      amount,
      balance_before,
      balance_after,
      reason,
      status,
      created_at
    FROM wallet_transactions
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `, [id]);

  // =========================
  // 4. SPENDING SUMMARY
  // =========================
  const [[spent]] = await pool.query(`
    SELECT 

      COALESCE((
        SELECT SUM(amount) 
        FROM chat_conversations 
        WHERE user_id = ?
        AND status IN ('ended','active','blocked')
      ),0) AS chatSpent,

      COALESCE((
        SELECT SUM(amount) 
        FROM call_history 
        WHERE user_id = ?
        AND status IN ('answered','hangup','disconnect')
      ),0) AS callSpent,

      COALESCE((
        SELECT SUM(amount) 
        FROM live_gifts 
        WHERE user_id = ?
      ),0) AS giftSpent

  `, [id, id, id]);

  // =========================
  // 5. SESSION COUNTS
  // =========================
  const [[counts]] = await pool.query(`
    SELECT

      (SELECT COUNT(*) FROM chat_conversations WHERE user_id = ?) AS chatSessions,

      (SELECT COUNT(*) FROM call_history WHERE user_id = ?) AS callSessions

  `, [id, id]);

  // =========================
  // 6. ASTROLOGER REVIEWS
  // =========================
  const [reviews] = await pool.query(`
    SELECT 
      ar.id,
      ar.astrologer_id,
      a.name AS astrologer_name,
      ar.user_id,
      ar.booking_type,
      ar.rating,
      ar.comment,
      ar.status,
      ar.created_at,
      ar.updated_at
    FROM astrologer_reviews ar
    JOIN astrologers a ON a.id = ar.astrologer_id
    WHERE ar.user_id = ?
    ORDER BY ar.created_at DESC
    LIMIT 20
  `, [id]);

  // =========================
  // 7. FINAL RESPONSE
  // =========================
  return {
    ...user,

    profile_image: user.profile_image
      ? `${process.env.BASE_URL}/uploads/${user.profile_image}`
      : null,

    sessions,
    transactions: txns,
    reviews,

    // 💰 SPENDING
    chatSpent: Number(spent.chatSpent || 0),
    callSpent: Number(spent.callSpent || 0),
    giftSpent: Number(spent.giftSpent || 0),

    totalSpent:
      Number(spent.chatSpent || 0) +
      Number(spent.callSpent || 0) +
      Number(spent.giftSpent || 0),

    // 📊 SESSION COUNTS
    chatSessions: Number(counts.chatSessions || 0),
    callSessions: Number(counts.callSessions || 0),
    totalSessions:
      Number(counts.chatSessions || 0) +
      Number(counts.callSessions || 0),
  };
};
exports.updateStatus = async (id, status) => {
  await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
};

exports.delete = async (id) => {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
};

exports.addWallet = async (id, amount, note) => {
  const [[wallet]] = await pool.query('SELECT balance FROM wallet WHERE user_id = ?', [id]);
  const before = parseFloat(wallet?.balance || 0);
  const after  = before + parseFloat(amount);

  await pool.query('INSERT INTO wallet (user_id, balance) VALUES (?,?) ON DUPLICATE KEY UPDATE balance = ?', [id, after, after]);
  await pool.query(
    'INSERT INTO wallet_transactions (user_id, type, amount, balance_before, balance_after, reason, status) VALUES (?,?,?,?,?,?,?)',
    [id, 'credit', amount, before, after, note || 'Admin credit', 'completed']
  );
};
