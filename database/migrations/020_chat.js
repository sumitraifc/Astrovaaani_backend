module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(100) DEFAULT NULL,
        conversation_id VARCHAR(50) DEFAULT NULL,
        user_id BIGINT NOT NULL,
        astrologer_id BIGINT NOT NULL,
        status ENUM('active','ended','blocked') DEFAULT 'active',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP NULL DEFAULT NULL,
        last_message_at TIMESTAMP NULL DEFAULT NULL,
        is_user_online TINYINT(1) DEFAULT 0,
        is_astrologer_online TINYINT(1) DEFAULT 0,
        total_messages INT DEFAULT 0,
        amount DECIMAL(10,2) DEFAULT 0.00,
        duration INT DEFAULT 0,
        charge_per_min DECIMAL(10,2) DEFAULT 0.00,
        admin_commission DECIMAL(5,2) DEFAULT 20.00,
        family_member_id BIGINT DEFAULT NULL,
        is_timer_running TINYINT(1) DEFAULT 0,
        disconnect_reason VARCHAR(255) DEFAULT NULL,
        user_rating TINYINT(1) DEFAULT NULL,
        user_review TEXT DEFAULT NULL,
        last_message TEXT DEFAULT NULL,
        booking_type ENUM('self','member') DEFAULT 'self',
        member_id BIGINT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(100) DEFAULT NULL,
        conversation_id VARCHAR(100) DEFAULT NULL,
        sender_type ENUM('user','astrologer') NOT NULL,
        sender_id BIGINT NOT NULL,
        message TEXT DEFAULT NULL,
        message_type ENUM('text','image','file') DEFAULT 'text',
        file_url VARCHAR(255) DEFAULT NULL,
        is_read TINYINT(1) DEFAULT 0,
        is_deleted TINYINT(1) DEFAULT 0,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
