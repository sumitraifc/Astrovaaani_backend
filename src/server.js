// const app = require("./app");
// require("dotenv").config();

// const PORT = process.env.PORT || 5675;

// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// /**
//  * =========================
//  * HANDLE UNHANDLED ERRORS
//  * =========================
//  */
// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Rejection:", err);
//   server.close(() => process.exit(1));
// });

// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
//   process.exit(1);
// });


const app = require("./app");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5675;

const server = http.createServer(app);

/**
 * SOCKET.IO INIT HERE
 */
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/**
 * SOCKET EVENTS
 */
require("./sockets/socket")(io);

/**
 * START SERVER
 */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});