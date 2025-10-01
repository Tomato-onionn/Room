const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // test kết nối
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected!");
    conn.release();
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }
}

function getDB() {
  if (!pool) throw new Error("DB not initialized. Call initDB() first.");
  return pool;
}

module.exports = { initDB, getDB };
