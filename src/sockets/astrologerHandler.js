const db = require("../config/db");

/* 🔹 GET ALL ASTROLOGERS */
async function getAllAstrologers() {
  const [astrologers] = await db.query(`
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
      created_at,
      updated_at,
      chat_status
    FROM astrologers
    WHERE status = 'active'
    ORDER BY
      CASE
        WHEN is_online = 1 AND chat_status = 'busy' THEN 1
        WHEN is_online = 1 THEN 2
        WHEN chat_status = 'offline' THEN 3
        ELSE 4
      END,
      rating DESC,
      name ASC
  `);

  return astrologers;
}

/* 🔹 GET SINGLE ASTROLOGER */
async function getSingleAstrologer(astrologerId) {
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
      created_at,
      updated_at,
      chat_status
    FROM astrologers
    WHERE id = ?
    LIMIT 1
  `, [astrologerId]);

  return rows[0] || null;
}

async function setAstrologerOnlineStatus(io, astrologerId, isOnline) {
  const statusValue = Number(isOnline);
  if (![0, 1].includes(statusValue)) {
    return null;
  }

  const [rows] = await db.query(
    `SELECT id FROM astrologers WHERE id = ? LIMIT 1`,
    [Number(astrologerId)]
  );

  if (!rows.length) {
    return null;
  }

  await db.query(
    `
      UPDATE astrologers
      SET is_online = ?,
          chat_status = CASE
            WHEN ? = 0 THEN 'offline'
            WHEN chat_status = 'offline' THEN 'online'
            ELSE chat_status
          END
      WHERE id = ?
    `,
    [statusValue, statusValue, Number(astrologerId)]
  );

  const updatedAstrologer = await getSingleAstrologer(Number(astrologerId));
  if (!updatedAstrologer) {
    return null;
  }

  io.emit("astrologer:single_updated", {
    success: true,
    message: "Astrologer status updated",
    data: updatedAstrologer
  });

  return updatedAstrologer;
}

async function setAstrologerChatStatus(io, astrologerId, chatStatus) {
  if (!['online', 'busy', 'offline'].includes(chatStatus)) {
    return null;
  }

  const [rows] = await db.query(
    `SELECT id FROM astrologers WHERE id = ? LIMIT 1`,
    [Number(astrologerId)]
  );

  if (!rows.length) {
    return null;
  }

  await db.query(
    `
      UPDATE astrologers
      SET chat_status = ?
      WHERE id = ?
    `,
    [chatStatus, Number(astrologerId)]
  );

  const updatedAstrologer = await getSingleAstrologer(Number(astrologerId));
  if (!updatedAstrologer) {
    return null;
  }

  io.emit("astrologer:single_updated", {
    success: true,
    message: "Astrologer chat status updated",
    data: updatedAstrologer
  });

  return updatedAstrologer;
}

function astrologerSocket(io, socket) {

  /* =========================================
     FIRST TIME FULL LIST
  ========================================= */

  socket.on("astrologer:get_list", async () => {

    try {

      const astrologers = await getAllAstrologers();

      if (!astrologers.length) {

        return socket.emit("astrologer:list_updated", {
          success: false,
          message: "No astrologers found",
          data: []
        });
      }

      socket.emit("astrologer:list_updated", {
        success: true,
        message: "Astrologer list fetched successfully",
        data: astrologers
      });

    } catch (error) {

      console.error("astrologer:get_list error:", error);

      socket.emit("astrologer:list_updated", {
        success: false,
        message: "Something went wrong",
        data: []
      });
    }
  });

  /* =========================================
     UPDATE STATUS
  ========================================= */

  socket.on("astrologer:update_status", async ({ astrologer_id, is_online }) => {

    try {

      if (!astrologer_id) {

        return socket.emit("astrologer:single_updated", {
          success: false,
          message: "Astrologer ID required"
        });
      }

      if (![0, 1].includes(Number(is_online))) {

        return socket.emit("astrologer:single_updated", {
          success: false,
          message: "Invalid online status"
        });
      }

      const updatedAstrologer = await setAstrologerOnlineStatus(io, astrologer_id, is_online);

      if (!updatedAstrologer) {

        return socket.emit("astrologer:single_updated", {
          success: false,
          message: "Astrologer not found or cannot update status"
        });
      }

      socket.emit("astrologer:single_updated", {
        success: true,
        message: "Astrologer updated successfully",
        data: updatedAstrologer
      });

    } catch (error) {

      console.error("astrologer:update_status error:", error);

      socket.emit("astrologer:single_updated", {
        success: false,
        message: "Something went wrong"
      });
    }
  });

  /* =========================================
     UPDATE RATING
  ========================================= */

  socket.on("astrologer:update_rating", async ({ astrologer_id, rating }) => {

    try {

      if (!astrologer_id) {

        return socket.emit("astrologer:single_updated", {
          success: false,
          message: "Astrologer ID required"
        });
      }

      await db.query(
        `UPDATE astrologers 
         SET rating = ?
         WHERE id = ?`,
        [Number(rating), Number(astrologer_id)]
      );

      const updatedAstrologer = await getSingleAstrologer(astrologer_id);

      if (!updatedAstrologer) {

        return socket.emit("astrologer:single_updated", {
          success: false,
          message: "Astrologer not found"
        });
      }

      io.emit("astrologer:single_updated", {
        success: true,
        message: "Rating updated successfully",
        data: updatedAstrologer
      });

    } catch (error) {

      console.error("astrologer:update_rating error:", error);

      socket.emit("astrologer:single_updated", {
        success: false,
        message: "Something went wrong"
      });
    }
  });
}

module.exports = {
  astrologerSocket,
  setAstrologerOnlineStatus,
  setAstrologerChatStatus
};