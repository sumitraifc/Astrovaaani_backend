const db = require("../../../config/db");

function getDates() {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  const startOfLastWeek = new Date(now);
  startOfLastWeek.setDate(now.getDate() - 14);

  const endOfLastWeek = new Date(now);
  endOfLastWeek.setDate(now.getDate() - 7);

  return {
    startOfMonth,
    startOfLastMonth,
    endOfLastMonth,
    startOfWeek,
    startOfLastWeek,
    endOfLastWeek
  };
}

exports.getHome = async (astrologerId) => {

  const {
    startOfMonth,
    startOfLastMonth,
    endOfLastMonth,
    startOfWeek,
    startOfLastWeek,
    endOfLastWeek
  } = getDates();

  // =========================
  // THIS MONTH EARNING
  // =========================
  const [thisMonth] = await db.query(`
    SELECT COALESCE(SUM(amount),0) as total
    FROM call_history
    WHERE agent_id = ?
    AND status = 'completed'
    AND created_at >= ?
  `, [astrologerId, startOfMonth]);

  const [thisMonthChat] = await db.query(`
    SELECT COALESCE(SUM(amount),0) as total
    FROM chat_conversations
    WHERE astrologer_id = ?
    AND status = 'ended'
    AND created_at >= ?
  `, [astrologerId, startOfMonth]);

  const thisMonthEarning =
    Number(thisMonth[0].total) +
    Number(thisMonthChat[0].total);

  // =========================
  // LAST MONTH EARNING
  // =========================
  const [lastMonth] = await db.query(`
    SELECT COALESCE(SUM(amount),0) as total
    FROM call_history
    WHERE agent_id = ?
    AND status = 'completed'
    AND created_at BETWEEN ? AND ?
  `, [astrologerId, startOfLastMonth, endOfLastMonth]);

  const [lastMonthChat] = await db.query(`
    SELECT COALESCE(SUM(amount),0) as total
    FROM chat_conversations
    WHERE astrologer_id = ?
    AND status = 'ended'
    AND created_at BETWEEN ? AND ?
  `, [astrologerId, startOfLastMonth, endOfLastMonth]);

  const lastMonthEarning =
    Number(lastMonth[0].total) +
    Number(lastMonthChat[0].total);

  // =========================
  // WEEK EARNING
  // =========================
  const [week] = await db.query(`
    SELECT COALESCE(SUM(amount),0) as total
    FROM call_history
    WHERE agent_id = ?
    AND status = 'completed'
    AND created_at >= ?
  `, [astrologerId, startOfWeek]);

  const [weekChat] = await db.query(`
    SELECT COALESCE(SUM(amount),0) as total
    FROM chat_conversations
    WHERE astrologer_id = ?
    AND status = 'ended'
    AND created_at >= ?
  `, [astrologerId, startOfWeek]);

  const thisWeekEarning =
    Number(week[0].total) +
    Number(weekChat[0].total);

  // =========================
  // WITHDRAWALS (FIXED ❗)
  // =========================
  const [thisMonthWithdraw] = await db.query(`
    SELECT COALESCE(SUM(amount),0) as total
    FROM astrologer_withdrawals
    WHERE astrologer_id = ?
    AND status IN ('approved','completed')
    AND requested_at >= ?
  `, [astrologerId, startOfMonth]);

  const [lastMonthWithdraw] = await db.query(`
    SELECT COALESCE(SUM(amount),0) as total
    FROM astrologer_withdrawals
    WHERE astrologer_id = ?
    AND status IN ('approved','completed')
    AND requested_at BETWEEN ? AND ?
  `, [astrologerId, startOfLastMonth, endOfLastMonth]);

  // =========================
  // CLIENTS
  // =========================
  const [thisWeekClients] = await db.query(`
    SELECT COUNT(DISTINCT user_id) as total
    FROM call_history
    WHERE agent_id = ?
    AND created_at >= ?
  `, [astrologerId, startOfWeek]);

  const [lastWeekClients] = await db.query(`
    SELECT COUNT(DISTINCT user_id) as total
    FROM call_history
    WHERE agent_id = ?
    AND created_at BETWEEN ? AND ?
  `, [astrologerId, startOfLastWeek, endOfLastWeek]);

  // =========================
  // REVIEWS
  // =========================
  const [thisWeekReviews] = await db.query(`
    SELECT COUNT(*) as total
    FROM astrologer_reviews
    WHERE astrologer_id = ?
    AND status='published'
    AND created_at >= ?
  `, [astrologerId, startOfWeek]);

  const [lastWeekReviews] = await db.query(`
    SELECT COUNT(*) as total
    FROM astrologer_reviews
    WHERE astrologer_id = ?
    AND status='published'
    AND created_at BETWEEN ? AND ?
  `, [astrologerId, startOfLastWeek, endOfLastWeek]);

  // =========================
  // RATING
  // =========================
  const [thisWeekRating] = await db.query(`
    SELECT COALESCE(AVG(rating),0) as avg
    FROM astrologer_reviews
    WHERE astrologer_id = ?
    AND status='published'
    AND created_at >= ?
  `, [astrologerId, startOfWeek]);

  const [lastWeekRating] = await db.query(`
    SELECT COALESCE(AVG(rating),0) as avg
    FROM astrologer_reviews
    WHERE astrologer_id = ?
    AND status='published'
    AND created_at BETWEEN ? AND ?
  `, [astrologerId, startOfLastWeek, endOfLastWeek]);

  // =========================
  // RESPONSE
  // =========================
  return {
    this_month_earning: thisMonthEarning,
    last_month_earning: lastMonthEarning,

    this_week_earning: thisWeekEarning,

    this_month_withdrawal: thisMonthWithdraw[0].total,
    last_month_withdrawal: lastMonthWithdraw[0].total,

    this_week_clients: thisWeekClients[0].total,
    last_week_clients: lastWeekClients[0].total,

    this_week_reviews: thisWeekReviews[0].total,
    last_week_reviews: lastWeekReviews[0].total,

    this_week_rating: Number(parseFloat(thisWeekRating[0].avg || 0).toFixed(1)),
    last_week_rating: Number(parseFloat(lastWeekRating[0].avg || 0).toFixed(1))
  };
};