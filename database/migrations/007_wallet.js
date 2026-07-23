module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE wallet (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT DEFAULT NULL,
        astrologer_id BIGINT DEFAULT NULL,
        balance DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE wallet_transactions (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT DEFAULT NULL,
        astrologer_id BIGINT DEFAULT NULL,
        reference_id BIGINT DEFAULT NULL,
        reference_type VARCHAR(50) DEFAULT NULL,
        type ENUM('credit','debit','refund') DEFAULT NULL,
        amount DECIMAL(10,2) DEFAULT NULL,
        balance_before DECIMAL(10,2) DEFAULT NULL,
        balance_after DECIMAL(10,2) DEFAULT NULL,
        reason VARCHAR(255) DEFAULT NULL,
        payment_method VARCHAR(50) DEFAULT NULL,
        payment_ref VARCHAR(200) DEFAULT NULL,
        status ENUM('pending','completed','failed') DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
