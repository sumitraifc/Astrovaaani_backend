const db = require("../../../config/db");

// find astrologer
exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM astrologers WHERE id=?",
    [id]
  );
  return rows[0];
};
exports.findByMobile = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM astrologers WHERE phone =?",
    [id]
  );
  return rows[0];
};

// create draft astrologer (step 1)
exports.create = async (data) => {
  const [result] = await db.query(
    "INSERT INTO astrologers SET ?",
    [data]
  );
  return result.insertId;
};

// update astrologer step data
exports.update = async (id, data) => {
  await db.query(
    "UPDATE astrologers SET ? WHERE id=?",
    [data, id]
  );
};

exports.getProfile = async (astrologerId) => {

  const [rows] = await db.query(`
    SELECT
      id,
      uuid,
      name,
      display_name,
      email,
      phone,
      gender,
      dob,
      profile_image,

      experience,
      rating,
      total_reviews,
      total_sessions,

      total_chats,
      total_audio,
      total_video,

      total_chat_minutes,
      total_audio_minutes,
      total_video_minutes,

      total_earnings,
      wallet_balance,
      commission_percent,

      education,
      education_cert,
      astro_cert,
      id_proof,
      address_proof,

      bank_name,
      account_number,
      ifsc_code,
      account_holder,
      upi_id,

      languages,
      expertise,

      chat_charge,
      audio_charge,
      video_charge,

      is_online,
      live_status,

      status,
      approval_status,
      rejection_reason,

      min_withdrawal,
      about,

      registration_step,
      registration_completed,

      step1_status,
      step2_status,
      step3_status,
      step4_status,
      step5_status,

      step1_remark,
      step2_remark,
      step3_remark,
      step4_remark,
      step5_remark,

      last_seen,
      device_type,
      device_id,
      fcm_token,

      created_at,
      updated_at
    FROM astrologers
    WHERE id = ?
    LIMIT 1
  `, [astrologerId]);

  return rows[0];
};


exports.uploadDocument = async (astrologerId, data) => {

  const {
    id_proof,
    address_proof,
    education_certificate,
    experience_certificate,
    professional_certificate,
    other_documents,
    id_proof_number
  } = data;

  const [result] = await db.query(`
    INSERT INTO astrologer_verification (
      astrologer_id,

      id_proof,
      address_proof,
      education_certificate,
      experience_certificate,
      professional_certificate,
      other_documents,

      id_proof_number,

      status,
      document_verified,

      created_at,
      updated_at
    )
    VALUES (?,?,?,?,?,?,?,?, 'under_review', 0, NOW(), NOW())
    ON DUPLICATE KEY UPDATE

      id_proof = VALUES(id_proof),
      address_proof = VALUES(address_proof),
      education_certificate = VALUES(education_certificate),
      experience_certificate = VALUES(experience_certificate),
      professional_certificate = VALUES(professional_certificate),
      other_documents = VALUES(other_documents),

      id_proof_number = VALUES(id_proof_number),

      status = 'under_review',
      document_verified = 0,

      updated_at = NOW()
  `, [
    astrologerId,
    id_proof,
    address_proof,
    education_certificate,
    experience_certificate,
    professional_certificate,
    other_documents,
    id_proof_number
  ]);

  return result;
};


exports.getTimeline = async (astrologerId) => {

  const [rows] = await db.query(`
    SELECT
      id,
      uuid,

      approval_status,
      approved_at,
      approved_by,
      rejection_reason,

      id_proof,
      address_proof,
      education_cert,
      astro_cert,

      created_at,
      updated_at,

      step1_status,
      step2_status,
      step3_status,
      step4_status,
      step5_status

    FROM astrologers
    WHERE id = ?
    LIMIT 1
  `, [astrologerId]);

  const data = rows[0];

  if (!data) return null;

  // 🔥 TIMELINE BUILD
  const timeline = [];

  timeline.push({
    status: "submitted",
    date: data.created_at
  });
const approvedAt = data.approved_at ? new Date(data.approved_at) : new Date();

const validityDate = new Date(approvedAt);
validityDate.setFullYear(validityDate.getFullYear() + 1);

  if (data.step1_status && data.step1_status !== "pending") {
    timeline.push({
      status: data.step1_status,
      date: data.updated_at
    });
  }

  if (data.step2_status && data.step2_status !== "pending") {
    timeline.push({
      status: data.step2_status,
      date: data.updated_at
    });
  }

  if (data.step3_status && data.step3_status !== "pending") {
    timeline.push({
      status: data.step3_status,
      date: data.updated_at
    });
  }

  if (data.step4_status && data.step4_status !== "pending") {
    timeline.push({
      status: data.step4_status,
      date: data.updated_at
    });
  }

  if (data.step5_status && data.step5_status !== "pending") {
    timeline.push({
      status: data.step5_status,
      date: data.updated_at
    });
  }

  timeline.push({
    status: data.approval_status,
    date: data.approved_at || data.updated_at
  });

  // 🔥 FINAL RESPONSE FORMAT
  return {
    verification_id: data.uuid || `VER${data.id}`,

    verification_by: data.approved_by || "System",

    verification_date: data.approved_at,

    next_review_date: data.next_review_date|| null ,
validity_date: data.validity_date|| validityDate,

    document_verified:
      data.approval_status === "approved" ? 1 : 0,

    status: data.approval_status,

    documents: {
      id_proof: data.id_proof,
      address_proof: data.address_proof,
      education_certificate: data.education_cert,
      astro_certificate: data.astro_cert,
      experience_certificate: null,
      professional_certificate: null,
      other_documents: null
    },

    timeline: timeline.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )
  };
};