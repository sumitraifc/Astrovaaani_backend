module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS call_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        agent_id INT NOT NULL,
        channel_name VARCHAR(100) DEFAULT NULL,
        call_type ENUM('video','audio') NOT NULL,
        duration INT DEFAULT 0,
        bonus_time INT DEFAULT 0,
        amount DECIMAL(10,2) DEFAULT 0.00,
        status ENUM('initiate','connecting','ringing','unanswered','answered','hangup','decline','disconnect') NOT NULL DEFAULT 'initiate',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        start_time BIGINT DEFAULT NULL,
        end_time BIGINT DEFAULT NULL,
        per_minute_charge DOUBLE DEFAULT NULL,
        admin_commission_percent DOUBLE DEFAULT NULL,
        call_long_duration VARCHAR(20) DEFAULT NULL,
        disconnect_reason VARCHAR(255) DEFAULT NULL,
        user_rating TINYINT(1) DEFAULT NULL,
        user_review TEXT DEFAULT NULL,
        recording_url VARCHAR(255) DEFAULT NULL,
        user_ip VARCHAR(50) DEFAULT NULL,
        app_version VARCHAR(20) DEFAULT NULL
      )
    `);
  }
};
