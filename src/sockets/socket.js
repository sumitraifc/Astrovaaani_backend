const chatHandlers = require("./chatHandlers");
const callHandlers = require("./callHandlers");
const astrologerchatlistHandler = require("./astrologerchatlistHandler");
const { astrologerSocket } = require("./astrologerHandler");

/**
 * =========================================
 * GLOBAL SOCKET CONNECTION MANAGER
 * =========================================
 */
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    // Initialize chat handlers
    const chatHandle = chatHandlers(io, socket);

    // Initialize call handlers
    const callHandle = callHandlers(io, socket);

    // Initialize astrologer list handlers
    const astrologerChatListHandle = astrologerchatlistHandler(io, socket);
    
    astrologerSocket(io, socket);

    /**
     * =========================================
     * DISCONNECT HANDLER
     * =========================================
     */
    socket.on("disconnect", async () => {
      try {
        console.log("Socket Disconnected:", socket.id);

        // Handle call disconnections
        await callHandle.handleCallDisconnect();

        // Handle chat disconnections
        await chatHandle.handleChatDisconnect();

        // Handle astrologer chat list disconnections
        // await astrologerChatListHandle.handleAstrologerChatListDisconnect();

      } catch (err) {
        console.log("Disconnect Error:", err.message);
      }
    });
  });
};
