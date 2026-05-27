const model = require("./model");

exports.saveMessage = async (data) => {
  if (!data.conversation_id || !data.sender_id) {
    throw new Error("Invalid message data");
  }

  const message = await model.insertMessage({
    conversation_id: data.conversation_id,
    sender_id: data.sender_id,
    sender_type: data.sender_type,
    message: data.message
  });

  return message;
};