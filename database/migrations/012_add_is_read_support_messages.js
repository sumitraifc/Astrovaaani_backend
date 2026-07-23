module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS support_ticket_messages (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ticket_id BIGINT NOT NULL,
        from_type ENUM('user','astrologer','admin') NOT NULL,
        sender_name VARCHAR(100) DEFAULT NULL,
        message TEXT DEFAULT NULL,
        is_read TINYINT(1) DEFAULT 0,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS support_ticket_attachments (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        message_id BIGINT NOT NULL,
        ticket_id BIGINT NOT NULL,
        file_url VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) DEFAULT NULL,
        file_type ENUM('image','file') DEFAULT 'image',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
