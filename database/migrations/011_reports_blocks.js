const pool = require('../../src/config/db');

async function up() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id                     INT PRIMARY KEY AUTO_INCREMENT,
      reported_by            ENUM('user','astrologer') NOT NULL,
      reporter_user_id       INT NULL,
      reporter_astrologer_id INT NULL,
      reported_user_id       INT NULL,
      reported_astrologer_id INT NULL,
      reason                 VARCHAR(255) NOT NULL,
      description            TEXT NULL,
      status                 ENUM('pending','reviewed','action_taken','ignored') DEFAULT 'pending',
      admin_note             TEXT NULL,
      action_taken           VARCHAR(255) NULL,
      created_at             DATETIME DEFAULT NOW(),
      updated_at             DATETIME DEFAULT NOW() ON UPDATE NOW(),
      FOREIGN KEY (reporter_user_id)       REFERENCES users(id)       ON DELETE SET NULL,
      FOREIGN KEY (reporter_astrologer_id) REFERENCES astrologers(id) ON DELETE SET NULL,
      FOREIGN KEY (reported_user_id)       REFERENCES users(id)       ON DELETE SET NULL,
      FOREIGN KEY (reported_astrologer_id) REFERENCES astrologers(id) ON DELETE SET NULL
    )
  `);
  console.log('✅ reports table created');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blocks (
      id                    INT PRIMARY KEY AUTO_INCREMENT,
      blocker_type          ENUM('user','astrologer') NOT NULL,
      blocker_user_id       INT NULL,
      blocker_astrologer_id INT NULL,
      blocked_user_id       INT NULL,
      blocked_astrologer_id INT NULL,
      created_at            DATETIME DEFAULT NOW(),
      UNIQUE KEY unique_block (blocker_user_id, blocker_astrologer_id, blocked_user_id, blocked_astrologer_id),
      FOREIGN KEY (blocker_user_id)       REFERENCES users(id)       ON DELETE CASCADE,
      FOREIGN KEY (blocker_astrologer_id) REFERENCES astrologers(id) ON DELETE CASCADE,
      FOREIGN KEY (blocked_user_id)       REFERENCES users(id)       ON DELETE CASCADE,
      FOREIGN KEY (blocked_astrologer_id) REFERENCES astrologers(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ blocks table created');
}

up().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
