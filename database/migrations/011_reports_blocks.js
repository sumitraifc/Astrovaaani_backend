module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reported_by ENUM('user','astrologer') NOT NULL,
        reporter_user_id INT DEFAULT NULL,
        reporter_astrologer_id INT DEFAULT NULL,
        reported_user_id INT DEFAULT NULL,
        reported_astrologer_id INT DEFAULT NULL,
        reason VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        status ENUM('pending','reviewed','action_taken','ignored') DEFAULT 'pending',
        admin_note TEXT DEFAULT NULL,
        action_taken VARCHAR(255) DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS blocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blocker_type ENUM('user','astrologer') NOT NULL,
        blocker_user_id INT DEFAULT NULL,
        blocker_astrologer_id INT DEFAULT NULL,
        blocked_user_id INT DEFAULT NULL,
        blocked_astrologer_id INT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
