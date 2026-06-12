require("dotenv").config();
const mysql = require("mysql2/promise");

const MAX_RETRIES = 10;
let retryCount = 0;

/**
 * =========================
 * MYSQL POOL
 * =========================
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+04:30' 
});

/**
 * =========================
 * DB CONNECTION CHECK
 * =========================
 */
const connectDB = async () => {
  try {
    if (!process.env.DB_HOST || !process.env.DB_USER) {
      throw new Error("DB environment variables missing");
    }

    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();

    retryCount = 0; // reset on success
  } catch (error) {
    retryCount++;

    console.log(`❌ DB connection failed (attempt ${retryCount})`);

    if (retryCount >= MAX_RETRIES) {
      console.error("❌ Max DB retries reached. Exiting process.");
      process.exit(1);
    }

    const delay = Math.min(5000 * retryCount, 30000); 

    console.log(`⏳ Retrying in ${delay / 1000}s...`);

    setTimeout(connectDB, delay);
  }
};

connectDB();

module.exports = pool;