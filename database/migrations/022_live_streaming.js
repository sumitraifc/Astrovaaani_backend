module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS live_streams (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        astrologer_id BIGINT NOT NULL,
        title VARCHAR(255) DEFAULT NULL,
        stream_key VARCHAR(100) NOT NULL,
        status ENUM('live','ended') DEFAULT 'live',
        viewer_count INT DEFAULT 0,
        total_likes INT DEFAULT 0,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS live_comments (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        stream_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        message TEXT NOT NULL,
        is_deleted TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS live_gifts (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        stream_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        astrologer_id BIGINT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        message VARCHAR(255) DEFAULT NULL,
        wallet_txn_id BIGINT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS live_likes (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        stream_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS live_viewers (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        stream_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        left_at DATETIME DEFAULT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
