module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS referral_histories (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        referrer_id BIGINT NOT NULL,
        referred_astrologer_id BIGINT NOT NULL,
        referral_code VARCHAR(20) DEFAULT NULL,
        bonus_amount DECIMAL(10,2) DEFAULT 0.00,
        status ENUM('pending','completed') DEFAULT 'pending',
        completed_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS referral_settings (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        referral_bonus DECIMAL(10,2) DEFAULT 100.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
};
