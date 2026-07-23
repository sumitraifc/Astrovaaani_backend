module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS astrologer_expertise (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        astrologer_id BIGINT DEFAULT NULL,
        expertise_id BIGINT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS astrologer_languages (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        astrologer_id BIGINT NOT NULL,
        language VARCHAR(50) NOT NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS astrologer_reviews (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        astrologer_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        booking_type ENUM('chat','audio','video') NOT NULL,
        rating TINYINT NOT NULL,
        comment TEXT DEFAULT NULL,
        status ENUM('published','private') DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS astrologer_withdrawals (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        astrologer_id BIGINT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        method VARCHAR(20) DEFAULT 'bank_transfer',
        utr_number VARCHAR(100) DEFAULT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        rejection_note TEXT DEFAULT NULL,
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at DATETIME DEFAULT NULL,
        processed_by BIGINT DEFAULT NULL
      )
    `);
  }
};
