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

// exports.getById = async (id) => {
//   const [[astro]] = await pool.query(`
//     SELECT a.*,
//       COALESCE(w.balance, 0) AS wallet_balance
//     FROM astrologers a
//     LEFT JOIN wallet w ON w.astrologer_id = a.id
//     WHERE a.id = ?
//   `, [id]);

//   if (!astro) return null;

//   const [sessions] = await pool.query(`
//     SELECT cc.id, 'chat' AS type, u.name AS user_name,
//       cc.duration, cc.amount, cc.status, cc.user_rating, cc.created_at
//     FROM chat_conversations cc
//     JOIN users u ON u.id = cc.user_id
//     WHERE cc.astrologer_id = ?
//     ORDER BY cc.created_at DESC LIMIT 20
//   `, [id]);

//   const [txns] = await pool.query(`
//     SELECT id, type, amount, balance_before, balance_after, reason, status, created_at
//     FROM wallet_transactions WHERE astrologer_id = ?
//     ORDER BY created_at DESC LIMIT 20
//   `, [id]);

//   const [reviews] = await pool.query(`
//     SELECT ar.id, ar.rating, ar.comment, ar.booking_type, ar.status,
//       u.name AS user_name, ar.created_at
//     FROM astrologer_reviews ar
//     JOIN users u ON u.id = ar.user_id
//     WHERE ar.astrologer_id = ?
//     ORDER BY ar.created_at DESC LIMIT 10
//   `, [id]);

//   return { ...astro, sessions, transactions: txns, reviews };
// };

exports.getById = async (id) => {
  const [[astro]] = await pool.query(`
    SELECT a.*,
      COALESCE(w.balance, 0) AS wallet_balance
    FROM astrologers a
    LEFT JOIN wallet w ON w.astrologer_id = a.id
    WHERE a.id = ?
  `, [id]);

  if (!astro) return null;

  // Document URLs
  const fileFields = [
    "profile_image",
    "education_cert",
    "astro_cert",
    "id_proof",
    "address_proof",
  ];

  fileFields.forEach((field) => {
    if (astro[field]) {
      astro[field] = `${process.env.BASE_URL}/uploads/${astro[field]}`;
    }
  });

  const [sessions] = await pool.query(`
    SELECT cc.id, 'chat' AS type, u.name AS user_name,
      cc.duration, cc.amount, cc.status, cc.user_rating, cc.created_at
    FROM chat_conversations cc
    JOIN users u ON u.id = cc.user_id
    WHERE cc.astrologer_id = ?
    ORDER BY cc.created_at DESC
    LIMIT 20
  `, [id]);

  const [txns] = await pool.query(`
    SELECT id, type, amount, balance_before, balance_after,
      reason, status, created_at
    FROM wallet_transactions
    WHERE astrologer_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `, [id]);

  const [reviews] = await pool.query(`
    SELECT
      ar.id,
      ar.rating,
      ar.comment,
      ar.booking_type,
      ar.status,
      u.name AS user_name,
      ar.created_at
    FROM astrologer_reviews ar
    JOIN users u ON u.id = ar.user_id
    WHERE ar.astrologer_id = ?
    ORDER BY ar.created_at DESC
    LIMIT 10
  `, [id]);
const [withdrawals] = await pool.query(`
  SELECT 
    id,
    amount,
    method,
    utr_number,
    status,
    rejection_note,
    requested_at,
    processed_at,
    processed_by
  FROM astrologer_withdrawals
  WHERE astrologer_id = ?
  ORDER BY requested_at DESC
`, [id]);
const [[stats]] = await pool.query(`
  SELECT

    -- CHAT
    COALESCE(SUM(cc.duration),0) AS chatMinutes,
    COALESCE(SUM(cc.amount),0) AS chatRevenue,
    COALESCE(SUM(cc.amount * (100 - cc.admin_commission) / 100),0) AS chatAstrologerEarning,
    COALESCE(SUM(cc.amount * cc.admin_commission / 100),0) AS chatAdminEarning,

    -- AUDIO
    COALESCE(SUM(CASE WHEN ch.call_type='audio' THEN ch.duration ELSE 0 END),0) AS audioMinutes,
    COALESCE(SUM(CASE WHEN ch.call_type='audio' THEN ch.amount ELSE 0 END),0) AS audioRevenue,
    COALESCE(SUM(CASE WHEN ch.call_type='audio' THEN ch.amount * (100 - ch.admin_commission_percent) / 100 ELSE 0 END),0) AS audioAstroEarning,
    COALESCE(SUM(CASE WHEN ch.call_type='audio' THEN ch.amount * ch.admin_commission_percent / 100 ELSE 0 END),0) AS audioAdminEarning,

    -- VIDEO
    COALESCE(SUM(CASE WHEN ch.call_type='video' THEN ch.duration ELSE 0 END),0) AS videoMinutes,
    COALESCE(SUM(CASE WHEN ch.call_type='video' THEN ch.amount ELSE 0 END),0) AS videoRevenue,
    COALESCE(SUM(CASE WHEN ch.call_type='video' THEN ch.amount * (100 - ch.admin_commission_percent) / 100 ELSE 0 END),0) AS videoAstroEarning,
    COALESCE(SUM(CASE WHEN ch.call_type='video' THEN ch.amount * ch.admin_commission_percent / 100 ELSE 0 END),0) AS videoAdminEarning

  FROM astrologers a

  LEFT JOIN chat_conversations cc 
    ON cc.astrologer_id = a.id 
    AND cc.status IN ('ended','active','blocked')

  LEFT JOIN call_history ch 
    ON ch.agent_id = a.id 
    AND ch.status IN ('answered','hangup','disconnect')

  WHERE a.id = ?
`, [id]);
 return {
  ...astro,
  sessions,
  transactions: txns,
  reviews,
  withdrawals,

  // =========================
  // CHAT
  // =========================
  chatMinutes: Number(stats.chatMinutes || 0),
  chatRevenue: Number(stats.chatRevenue || 0),
  chatAstrologerEarning: Number(stats.chatAstrologerEarning || 0),
  chatAdminEarning: Number(stats.chatAdminEarning || 0),

  // =========================
  // AUDIO
  // =========================
  audioMinutes: Number(stats.audioMinutes || 0),
  audioRevenue: Number(stats.audioRevenue || 0),
  audioAstrologerEarning: Number(stats.audioAstroEarning || 0),
  audioAdminEarning: Number(stats.audioAdminEarning || 0),

  // =========================
  // VIDEO
  // =========================
  videoMinutes: Number(stats.videoMinutes || 0),
  videoRevenue: Number(stats.videoRevenue || 0),
  videoAstrologerEarning: Number(stats.videoAstroEarning || 0),
  videoAdminEarning: Number(stats.videoAdminEarning || 0),

  // =========================
  // TOTAL ADMIN
  // =========================
  totalAdminEarning:
    Number(stats.chatAdminEarning || 0) +
    Number(stats.audioAdminEarning || 0) +
    Number(stats.videoAdminEarning || 0),
};
};

exports.updateStepStatus = async (id, step, status, remark, adminId) => {
  const stepCol   = `step${step}_status`;
  const remarkCol = `step${step}_remark`;

  // Update step status + remark
  await pool.query(
    `UPDATE astrologers SET ${stepCol} = ?, ${remarkCol} = ? WHERE id = ?`,
    [status, remark || null, id]
  );

  // Re-fetch all step statuses
  const [[astro]] = await pool.query(
    'SELECT step1_status, step2_status, step3_status, step4_status, step5_status, registration_step FROM astrologers WHERE id = ?',
    [id]
  );

  const allApproved = [1,2,3,4,5].every((s) => astro[`step${s}_status`] === 'approved');
  const anyRejected = [1,2,3,4,5].some((s)  => astro[`step${s}_status`] === 'rejected');

  let approvalStatus   = 'pending';
  let registrationStep = astro.registration_step;

  if (allApproved) {
    approvalStatus   = 'approved';
    registrationStep = 5;
  } else if (anyRejected) {
    approvalStatus = 'partial_rejected';
    // Send astrologer back to the rejected step so they can resubmit
    if (status === 'rejected') registrationStep = step;
  } else if (status === 'approved') {
    // This step approved, let astrologer move to next step
    approvalStatus   = 'resume';
    registrationStep = step + 1;
  }

  await pool.query(
    `UPDATE astrologers SET approval_status = ?, registration_step = ?, approved_at = ?, approved_by = ? WHERE id = ?`,
    [approvalStatus, registrationStep, allApproved ? new Date() : null, allApproved ? adminId : null, id]
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
