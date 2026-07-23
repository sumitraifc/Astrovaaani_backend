module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS withdrawal_charges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tds_percent DECIMAL(5,2) DEFAULT 5.00,
        processing_percent DECIMAL(5,2) DEFAULT 2.00,
        fixed_processing_fee DECIMAL(10,2) DEFAULT 0.00,
        is_active TINYINT(4) DEFAULT 1,
        min_withdrawal DECIMAL(10,2) DEFAULT 100.00,
        max_withdrawal DECIMAL(10,2) DEFAULT 50000.00,
        suggested_amounts JSON DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
};
