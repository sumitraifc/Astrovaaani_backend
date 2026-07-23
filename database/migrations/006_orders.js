module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE orders (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(100) DEFAULT NULL,
        conversation_id VARCHAR(100) DEFAULT NULL,
        user_id BIGINT DEFAULT NULL,
        astrologer_id INT DEFAULT NULL,
        astrologer_name VARCHAR(100) DEFAULT NULL,
        consultation_type ENUM('chat','call','video','audio','live') DEFAULT NULL,
        price DECIMAL(10,2) DEFAULT NULL,
        image VARCHAR(255) DEFAULT NULL,
        status ENUM('pending','completed','cancelled','refunded') DEFAULT 'pending',
        start_time DATETIME DEFAULT NULL,
        end_time DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
