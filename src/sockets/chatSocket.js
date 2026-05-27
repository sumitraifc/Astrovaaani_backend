module.exports = (io) => {
  io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    // JOIN ROOM (IMPORTANT)
    socket.on("join_room", (conversationId) => {
      socket.join("room_" + conversationId);
      console.log("Joined room:", conversationId);
    });

    // SEND MESSAGE
    socket.on("send_message", async (data) => {
      try {

        const saved = await require("../modules/chat/controller")
          .saveMessage(data);

        io.to("room_" + data.conversation_id).emit(
          "receive_message",
          saved
        );

      } catch (err) {
        console.log("Socket Error:", err.message);
      }
    });

  });
};