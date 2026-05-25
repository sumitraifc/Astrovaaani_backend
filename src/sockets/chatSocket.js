module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    // receive message
    socket.on("send_message", (data) => {

      console.log("Message:", data);

      // send to all users
      io.emit("receive_message", {
        sender: socket.id,
        message: data.message
      });

    });

    // disconnect
    socket.on("disconnect", () => {

      console.log("User Disconnected:", socket.id);

    });

  });

};