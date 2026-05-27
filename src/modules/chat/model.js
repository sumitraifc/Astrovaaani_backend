const db = require("../../config/db");

exports.insertMessage = async (data) => {

  const [result] = await db.query(
    `
    INSERT INTO chat_messages 
    (conversation_id, sender_id, sender_type, message)
    VALUES (?, ?, ?, ?)
    `,
    [
      data.conversation_id,
      data.sender_id,
      data.sender_type,
      data.message
    ]
  );

  return {
    id: result.insertId,
    ...data
  };
};