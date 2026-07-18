const chatHandlers = require("./chatHandlers");
const callHandlers = require("./callHandlers");
const astrologerchatlistHandler = require("./astrologerchatlistHandler");
const { astrologerSocket } = require("./astrologerHandler");
const liveHandler = require("./liveHandler");
const notificationcountHandler = require("./notificationcountHandler");
const supportChatHandler = require("./supportChatHandler");

/**
 * =========================================
 * GLOBAL SOCKET CONNECTION MANAGER
 * =========================================
 */
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    // JWT se user_id nikalo aur personal room join karo
    try {
      const token = socket.handshake.auth?.token;
      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id) {
          socket.join(`user_${decoded.id}`);
          console.log(`Socket ${socket.id} joined room user_${decoded.id}`);
        }
      }
    } catch (_) {}

    // Initialize chat handlers
    const chatHandle = chatHandlers(io, socket);

    // Initialize call handlers
    const callHandle = callHandlers(io, socket);

     notificationcountHandler(io, socket);

    // Initialize astrologer list handlers
    const astrologerChatListHandle = astrologerchatlistHandler(io, socket);
    
     const { handleLiveDisconnect } = liveHandler(io, socket);

    astrologerSocket(io, socket);

    const { handleSupportDisconnect } = supportChatHandler(io, socket);

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
          
        await handleLiveDisconnect();
        handleSupportDisconnect();
        // Handle astrologer chat list disconnections
        // await astrologerChatListHandle.handleAstrologerChatListDisconnect();

      } catch (err) {
        console.log("Disconnect Error:", err.message);
      }
    });
  });
};
