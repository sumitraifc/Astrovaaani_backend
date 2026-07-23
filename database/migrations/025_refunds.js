module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS refunds (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        wallet_transaction_id BIGINT DEFAULT NULL,
        call_history_id INT DEFAULT NULL,
        conversation_id BIGINT DEFAULT NULL,
        amount DECIMAL(12,2) NOT NULL,
        reason TEXT DEFAULT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        rejection_note TEXT DEFAULT NULL,
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at DATETIME DEFAULT NULL,
        processed_by BIGINT DEFAULT NULL
      )
    `);
  }
};
