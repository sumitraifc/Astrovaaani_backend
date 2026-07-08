process.env.TZ = 'Asia/Kolkata';
const express = require("express");
require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const hpp = require("hpp");
const { Server } = require("socket.io");


const path = require("path");
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

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

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
  max: 1000, // 1000 requests per 15 minutes
  skip: (req) => req.path.startsWith('/api/admin'), // Admin routes skip rate limit
});
app.use(limiter);

/**
 * =========================
 * BODY PARSER
 * =========================
 */
app.use(express.json());
// parse application/x-www-form-urlencoded (Cashfree may send form-encoded webhooks)
app.use(express.urlencoded({ extended: true }));


/**
 * STATIC FILES
 */
app.use(express.static(path.join(__dirname, "..", "public")));

/**
 * SOCKET.IO
 */
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });


// 
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static("uploads"));
// require("./sockets/chatSocket")(io);

/**
 * =========================
 * ROUTES
 * =========================
 */
app.use("/api/users", require("./modules/user/routes"));

app.use("/api/app-config", require("./modules/appConfig/routes"));

app.use("/api/horoscope",require("./modules/horoscope/routes"));

app.use("/api/bank-details",require("./modules/bankifsc/routes"));


app.use("/api/panchang",require("./modules/Panchang/routes"));

app.use("/api/orders", require("./modules/orders/routes"));

app.use("/api/wallet", require("./modules/wallet/routes"));

app.use("/api/notifications", require("./modules/notifications/routes"));

app.use("/api/astrologers",require("./modules/astrologers/routes"));

app.use("/api/favorites", require("./modules/favorite/routes"));

app.use("/api/expertise", require("./modules/expertise/routes"));

app.use("/api/call", require("./modules/call/routes"));
app.use("/api/live", require("./modules/live/routes")); 

app.use("/api", require("./modules/uploadsfile/routes")); // Upload route for chat files
//admin 
app.use("/api/astrologer", require("./modules/astrosubmodule/astrologer/routes"));

app.use("/api/astrologer/bankdetails", require("./modules/astrosubmodule/bankdetails/routes"));

app.use("/api/astrologer-earning/", require("./modules/astrosubmodule/astrolagerearning/routes"));

app.use("/api/astrologerwithdraw", require("./modules/astrosubmodule/astrologerwithdrawal/routes"));

app.use("/api/booking/", require("./modules/astrosubmodule/astrologerbookinghistory/routes"));

app.use("/api/reviews/", require("./modules/astrosubmodule/reviews/routes"));

app.use("/api/astrologer/service/", require("./modules/astrosubmodule/astrologerservice/routes"));

app.use("/api/astrologer/home/", require("./modules/astrosubmodule/astrologerhome/routes"));

app.use("/api/astrologer/support-legal", require("./modules/astrosubmodule/astrosupportandleagl/routes"));

app.use("/api/user/gift-amount", require("./modules/giftamounthandle/routes"));

app.use("/api/support", require("./modules/supportticket/routes"));

app.use("/api/report", require("./modules/report/routes"));
app.use("/api/block",  require("./modules/block/routes"));

app.use(
    "/api/referral",
    require("./modules/referral/routes")
);

// ─── Admin Routes ───────────────────────────────────────────────────────────
app.use("/api/admin/auth",          require("./modules/admin/auth/routes"));
app.use("/api/admin/dashboard",     require("./modules/admin/dashboard/routes"));
app.use("/api/admin/users",         require("./modules/admin/users/routes"));
app.use("/api/admin/astrologers",   require("./modules/admin/astrologers/routes"));
app.use("/api/admin/banners",       require("./modules/admin/banners/routes"));
app.use("/api/admin/sessions",      require("./modules/admin/sessions/routes"));
app.use("/api/admin/transactions",  require("./modules/admin/transactions/routes"));
app.use("/api/admin/refunds",       require("./modules/admin/refunds/routes"));
app.use("/api/admin/notifications", require("./modules/admin/notifications/routes"));
app.use("/api/admin/settings",      require("./modules/admin/settings/routes"));
app.use("/api/admin/expertise",     require("./modules/admin/expertise/routes"));
app.use("/api/admin/support",             require("./modules/admin/support/routes"));
app.use("/api/admin/withdrawals",         require("./modules/admin/withdrawals/routes"));
app.use("/api/admin/admin-payout",        require("./modules/admin/admin-payout/routes"));
app.use("/api/admin/reviews",             require("./modules/admin/reviews/routes"));
app.use("/api/admin/withdrawal-charges",  require("./modules/admin/withdrawal-charges/routes"));
app.use("/api/admin/referral-settings",   require("./modules/admin/referral-settings/routes"));
app.use("/api/admin/reports",             require("./modules/admin/reports/routes"));

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
/**
 * =========================
 * 404 HANDLER (ADD THIS)
 * =========================
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});
module.exports = app; 