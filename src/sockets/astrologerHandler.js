const db = require("../config/db");
const { sendNotification } = require("../config/notification");
/* =========================
   GET ALL ASTROLOGERS
========================= */
async function getAllAstrologers(userId) {
  const params = [];
  let blockFilter = '';

  if (userId) {
    blockFilter = `AND id NOT IN (
      SELECT blocked_astrologer_id FROM blocks
      WHERE blocker_user_id = ? AND blocked_astrologer_id IS NOT NULL
    )`;
    params.push(userId);
  }

  const [rows] = await db.query(`
    SELECT
      id,
      uuid,
      name,
      profile_image,
      experience,
      rating,
      total_reviews,
      languages,
      expertise,
      chat_charge,
      audio_charge,
      video_charge,
      is_online,
      status,
      about,
      approval_status,
      step1_status,
      step2_status,
      step3_status,
      step4_status,
      step5_status,
      created_at,
      updated_at,
      live_status
    FROM astrologers
    WHERE status = 'active'
    AND approval_status = 'approved'
    ${blockFilter}
    ORDER BY
      CASE
        WHEN is_online = 1 AND live_status = 'busy' THEN 1
        WHEN is_online = 1 THEN 2
        WHEN live_status = 'offline' THEN 3
        ELSE 4
      END,
      rating DESC,
      name ASC
  `, params);

  return rows.map(formatAstrologer);
}


/* =========================
   GET SINGLE ASTROLOGER
========================= */
async function getSingleAstrologer(astrologerId) {
  const [rows] = await db.query(`
    SELECT
      id,
      uuid,
      name,
      phone,
      email,
      profile_image,
      experience,
      rating,
      total_reviews,
      languages,
      expertise,
      chat_charge,
      audio_charge,
      video_charge,
      is_online,
      status,
      about,
      approval_status,
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
      registration_step,
      registration_completed,
      created_at,
      updated_at,
      live_status
    FROM astrologers
    WHERE id = ?
    LIMIT 1
  `, [astrologerId]);

  // return rows[0] || null;
  return formatAstrologer(rows[0] || null);
}

/* =========================
   PROFILE URL FUNCATIO
========================= */

function formatAstrologer(astrologer) {
  if (astrologer?.profile_image) {
    astrologer.profile_image =
      `${process.env.BASE_URL}/uploads/${astrologer.profile_image}`;
  }

  return astrologer;
}
/* =========================
   ONLINE STATUS UPDATE
========================= */
async function setAstrologerOnlineStatus(io, astrologerId, isOnline) {

  // const statusValue = Number(isOnline);
  // if (![0, 1].includes(statusValue)) return null;
  
const statusValue = Number(isOnline);
if (![0, 1, 2].includes(statusValue)) return null;

  const [rows] = await db.query(
    `SELECT id FROM astrologers WHERE id = ? LIMIT 1`,
    [astrologerId]
  );

  if (!rows.length) return null;

  // await db.query(
  //   `
  //   UPDATE astrologers
  //   SET is_online = ?,
  //       live_status = CASE
  //         WHEN ? = 0 THEN 'offline'
  //         WHEN live_status = 'offline' THEN 'online'
  //         ELSE live_status
  //       END
  //   WHERE id = ?
  //   `,
  //   [statusValue, statusValue, astrologerId]
  // );
await db.query(
  `
  UPDATE astrologers
  SET is_online = ?,
      live_status = CASE
        WHEN ? = 0 THEN 'offline'
        WHEN ? = 1 THEN 'online'
        WHEN ? = 2 THEN 'busy'
      END
  WHERE id = ?
  `,
  [statusValue, statusValue, statusValue, statusValue, astrologerId]
);
  const updated = await getSingleAstrologer(astrologerId);

  io.emit("astrologer:single_updated", {
    success: true,
    message: "Status updated",
    data: updated
  });

  return updated;
}

/* =========================
   CHAT STATUS UPDATE
========================= */
async function setAstrologerChatStatus(io, astrologerId, chatStatus) {

  if (!['online', 'busy', 'offline'].includes(chatStatus)) return null;

  const [rows] = await db.query(
    `SELECT id FROM astrologers WHERE id = ? LIMIT 1`,
    [astrologerId]
  );

  if (!rows.length) return null;

  await db.query(
    `
    UPDATE astrologers
    SET live_status = ?
    WHERE id = ?
    `,
    [chatStatus, astrologerId]
  );

  const updated = await getSingleAstrologer(astrologerId);

  io.emit("astrologer:single_updated", {
    success: true,
    message: "Chat status updated",
    data: updated
  });

  return updated;
}

/* =========================
   STEP STATUS UPDATE (ADMIN USE)
   ========================= */
async function updateStepStatus(io, astrologerId, step, status, remark = null) {

  const allowedSteps = [1,2,3,4,5];
  const allowedStatus = ['pending','approved','rejected'];

  if (!allowedSteps.includes(step)) return null;
  if (!allowedStatus.includes(status)) return null;

  const stepField = `step${step}_status`;
  const remarkField = `step${step}_remark`;

  await db.query(
    `
    UPDATE astrologers
    SET ${stepField} = ?,
        ${remarkField} = ?
    WHERE id = ?
    `,
    [status, remark, astrologerId]
  );

  const updated = await getSingleAstrologer(astrologerId);

  io.emit("astrologer:single_updated", {
    success: true,
    message: `Step ${step} updated`,
    data: updated
  });

  return updated;
}

/* =========================
   SOCKET HANDLER
========================= */
function astrologerSocket(io, socket) {

  /* GET LIST */
  socket.on("astrologer:get_list", async (payload, ack) => {
    try {
      // JWT se user_id nikalo, frontend ko pass nahi karna
      let user_id = null;
      try {
        const token = socket.handshake.auth?.token;
        if (token) {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log('[astrologer:get_list] decoded JWT:', decoded);
          user_id = decoded.id || null;
          console.log('[astrologer:get_list] user_id:', user_id);
        } else {
          console.log('[astrologer:get_list] No token found in socket.handshake.auth');
        }
      } catch (err) {
        console.log('[astrologer:get_list] JWT error:', err.message);
      }

      const data = await getAllAstrologers(user_id);

      socket.emit("astrologer:list_updated", {
        success: true,
        data
      });

      ack?.({
        success: true,
        data
      });

    } catch (e) {

      const error = {
        success: false,
        message: e.message || "Error"
      };

      socket.emit("astrologer:list_updated", error);

      ack?.(error);
    }
  });

  /* ONLINE STATUS */
  socket.on("astrologer:update_status", async (data, ack) => {
    try {

      const updated = await setAstrologerOnlineStatus(
        io,
        data.astrologer_id,
        data.is_online
      );

      ack?.({
        success: true,
        message: "Status updated",
        data: updated
      });

    } catch (e) {

      ack?.({
        success: false,
        message: e.message
      });
    }
  });

  /* CHAT STATUS */
  socket.on("astrologer:update_chat_status", async (data, ack) => {
    try {

      const updated = await setAstrologerChatStatus(
        io,
        data.astrologer_id,
        data.chat_status
      );

      ack?.({
        success: true,
        message: "Chat status updated",
        data: updated
      });

    } catch (e) {

      ack?.({
        success: false,
        message: e.message
      });
    }
  });

  /* STEP STATUS UPDATE */
  socket.on("astrologer:update_step_status", async (data, ack) => {
    try {

      const updated = await updateStepStatus(
        io,
        data.astrologer_id,
        data.step,
        data.status,
        data.remark
      );

      ack?.({
        success: true,
        message: `Step ${data.step} updated`,
        data: updated
      });

    } catch (e) {

      ack?.({
        success: false,
        message: e.message
      });
    }
  });

  /* RATING */
  socket.on(
    "astrologer:update_rating",
    async ({ astrologer_id, rating }, ack) => {

      try {

        await db.query(
          `UPDATE astrologers SET rating=? WHERE id=?`,
          [rating, astrologer_id]
        );

        const updated = await getSingleAstrologer(astrologer_id);

        io.emit("astrologer:single_updated", {
          success: true,
          data: updated
        });

        ack?.({
          success: true,
          message: "Rating updated",
          data: updated
        });

      } catch (e) {

        ack?.({
          success: false,
          message: e.message
        });
      }
    }
  );
}

module.exports = {
  astrologerSocket,
  setAstrologerOnlineStatus,
  setAstrologerChatStatus,
  updateStepStatus
};