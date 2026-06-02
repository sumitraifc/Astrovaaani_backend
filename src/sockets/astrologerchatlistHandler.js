socket.on(
  "astrologer_chat_list",
  async (data, callback) => {
    try {

      const { astrologer_id } = data;

      const [rows] = await db.query(`
        SELECT
          cc.id,
          cc.conversation_id,
          cc.status,
          cc.last_message_at,
          cc.is_user_online,

          u.id AS user_id,
          u.name AS user_name,
          u.profile_image,

          (
            SELECT cm.message
            FROM chat_messages cm
            WHERE cm.conversation_id = cc.conversation_id
            ORDER BY cm.id DESC
            LIMIT 1
          ) AS last_message,

          (
            SELECT cm.created_at
            FROM chat_messages cm
            WHERE cm.conversation_id = cc.conversation_id
            ORDER BY cm.id DESC
            LIMIT 1
          ) AS message_time,

          (
            SELECT COUNT(*)
            FROM chat_messages cm
            WHERE cm.conversation_id = cc.conversation_id
            AND cm.sender_type = 'user'
            AND cm.is_read = 0
          ) AS unread_count

        FROM chat_conversations cc

        INNER JOIN users u
          ON u.id = cc.user_id

        WHERE cc.astrologer_id = ?

        ORDER BY
          cc.last_message_at DESC,
          cc.id DESC
      `, [astrologer_id]);

      callback({
        success: true,
        total: rows.length,
        data: rows
      });

    } catch (error) {

      callback({
        success: false,
        message: error.message
      });

    }
  }
);