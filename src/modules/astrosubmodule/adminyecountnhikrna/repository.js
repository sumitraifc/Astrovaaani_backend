const db = require("../../../config/db");

exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM astrologers WHERE id = ?",
    [id]
  );
  return rows[0];
};

exports.updateStep = async (id, step, status, remark) => {
  const stepStatusKey = `step${step}_status`;
  const stepRemarkKey = `step${step}_remark`;

  // Determine overall approval_status and registration_step
  let approvalStatus = "partial_rejected";
  let registrationStep = step; // send back to rejected step

  if (status === "approved") {
    approvalStatus = "resume";
    registrationStep = step + 1; // allow to proceed
  }

  // If step 5 approved → fully approved
  if (step === 5 && status === "approved") {
    approvalStatus = "approved";
    registrationStep = 5;
  }

  await db.query(
    `UPDATE astrologers SET
      ${stepStatusKey} = ?,
      ${stepRemarkKey} = ?,
      approval_status = ?,
      registration_step = ?,
      updated_at = NOW()
    WHERE id = ?`,
    [status, remark || null, approvalStatus, registrationStep, id]
  );
};

exports.getAll = async ({ page = 1, limit = 20, approval_status }) => {
  const offset = (page - 1) * limit;
  const where = approval_status ? "WHERE approval_status = ?" : "";
  const params = approval_status
    ? [approval_status, limit, offset]
    : [limit, offset];

  const [rows] = await db.query(
    `SELECT id, uuid, name, phone, email, profile_image,
      approval_status, registration_step, registration_completed,
      step1_status, step2_status, step3_status, step4_status, step5_status,
      created_at
     FROM astrologers ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    params
  );
  return rows;
};
