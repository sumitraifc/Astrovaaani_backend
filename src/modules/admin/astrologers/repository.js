const pool = require('../../../config/db');

exports.getList = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1';
  const params = [];

  if (search) {
    where += ' AND (a.name LIKE ? OR a.phone LIKE ? OR a.email LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  // status maps to approval_status
  const validStatuses = ['pending', 'approved', 'rejected', 'partial'];
  if (status && status !== 'all' && validStatuses.includes(status)) {
    if (status === 'partial') {
      where += ` AND a.approval_status NOT IN ('approved','rejected') AND (
        a.step1_status IS NOT NULL OR a.step2_status IS NOT NULL OR
        a.step3_status IS NOT NULL OR a.step4_status IS NOT NULL OR a.step5_status IS NOT NULL
      )`;
    } else {
      where += ' AND a.approval_status = ?';
      params.push(status);
    }
  }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM astrologers a ${where}`, params
  );

  const [rows] = await pool.query(`
    SELECT a.id, a.uuid, a.name, a.email, a.phone, a.gender, a.dob, a.display_name,
      a.profile_image, a.experience, a.rating, a.total_reviews, a.total_sessions,
      a.total_earnings, a.wallet_balance, a.commission_percent, a.education,
      a.languages, a.expertise, a.chat_charge, a.audio_charge, a.video_charge,
      a.is_online, a.status, a.approval_status, a.live_status,
      a.step1_status, a.step2_status, a.step3_status, a.step4_status, a.step5_status,
      a.step1_remark, a.step2_remark, a.step3_remark, a.step4_remark, a.step5_remark,
      a.rejection_reason, a.approved_at, a.created_at
    FROM astrologers a
    ${where}
    ORDER BY a.id DESC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  return { total, data: rows };
};

exports.getById = async (id) => {
  const [[astro]] = await pool.query(`
    SELECT a.*,
      COALESCE(w.balance, 0) AS wallet_balance
    FROM astrologers a
    LEFT JOIN wallet w ON w.astrologer_id = a.id
    WHERE a.id = ?
  `, [id]);

  if (!astro) return null;

  const [sessions] = await pool.query(`
    SELECT cc.id, 'chat' AS type, u.name AS user_name,
      cc.duration, cc.amount, cc.status, cc.user_rating, cc.created_at
    FROM chat_conversations cc
    JOIN users u ON u.id = cc.user_id
    WHERE cc.astrologer_id = ?
    ORDER BY cc.created_at DESC LIMIT 20
  `, [id]);

  const [txns] = await pool.query(`
    SELECT id, type, amount, balance_before, balance_after, reason, status, created_at
    FROM wallet_transactions WHERE astrologer_id = ?
    ORDER BY created_at DESC LIMIT 20
  `, [id]);

  const [reviews] = await pool.query(`
    SELECT ar.id, ar.rating, ar.comment, ar.booking_type, ar.status,
      u.name AS user_name, ar.created_at
    FROM astrologer_reviews ar
    JOIN users u ON u.id = ar.user_id
    WHERE ar.astrologer_id = ?
    ORDER BY ar.created_at DESC LIMIT 10
  `, [id]);

  return { ...astro, sessions, transactions: txns, reviews };
};

exports.updateStepStatus = async (id, step, status, remark, adminId) => {
  const stepCol  = `step${step}_status`;
  const remarkCol = `step${step}_remark`;

  await pool.query(
    `UPDATE astrologers SET ${stepCol} = ?, ${remarkCol} = ? WHERE id = ?`,
    [status, remark || null, id]
  );

  // Check if all 5 steps are approved → set approval_status = approved
  const [[astro]] = await pool.query(
    'SELECT step1_status, step2_status, step3_status, step4_status, step5_status FROM astrologers WHERE id = ?',
    [id]
  );

  const allApproved = [1, 2, 3, 4, 5].every((s) => astro[`step${s}_status`] === 'approved');
  const anyRejected = [1, 2, 3, 4, 5].some((s) => astro[`step${s}_status`] === 'rejected');

  let approvalStatus = 'pending';
  if (allApproved) approvalStatus = 'approved';
  else if (anyRejected) approvalStatus = 'partial';

  await pool.query(
    `UPDATE astrologers SET approval_status = ?, approved_at = ?, approved_by = ? WHERE id = ?`,
    [approvalStatus, allApproved ? new Date() : null, allApproved ? adminId : null, id]
  );

  return approvalStatus;
};

exports.updateStatus = async (id, status) => {
  await pool.query('UPDATE astrologers SET status = ? WHERE id = ?', [status, id]);
};

exports.delete = async (id) => {
  await pool.query('DELETE FROM astrologers WHERE id = ?', [id]);
};

exports.updateCommission = async (id, commission) => {
  await pool.query('UPDATE astrologers SET commission_percent = ? WHERE id = ?', [commission, id]);
};
