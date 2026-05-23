const express = require("express");
require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();

/**
 * =========================
 * SECURITY MIDDLEWARES
 * =========================
 */
app.use(helmet());
app.use(cors({
  origin: "*", // later restrict to frontend domain
}));
app.use(xss());
app.use(hpp());

/**
 * =========================
 * LOGGING
 * =========================
 */
app.use(morgan("dev"));

/**
 * =========================
 * RATE LIMITING
 * =========================
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/**
 * =========================
 * BODY PARSER
 * =========================
 */
app.use(express.json());

/**
 * =========================
 * ROUTES
 * =========================
 */
app.use("/api/users", require("./modules/user/routes"));
app.use("/api/app-config", require("./modules/appConfig/routes"));
app.use("/api/horoscope",require("./modules/horoscope/routes"));

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/**
 * =========================
 * GLOBAL ERROR HANDLER
 * =========================
 */
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;