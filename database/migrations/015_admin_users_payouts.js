module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        status VARCHAR(20) DEFAULT 'active',
        last_login DATETIME DEFAULT NULL,
        bank_name VARCHAR(100) DEFAULT NULL,
        bank_account_number VARCHAR(30) DEFAULT NULL,
        bank_ifsc VARCHAR(20) DEFAULT NULL,
        bank_holder_name VARCHAR(100) DEFAULT NULL,
        upi_id VARCHAR(100) DEFAULT NULL,
        preferred_method VARCHAR(10) DEFAULT 'bank',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_admin_email (email)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_payouts (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        admin_id BIGINT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        method VARCHAR(20) NOT NULL DEFAULT 'bank',
        note TEXT DEFAULT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_admin_id (admin_id)
      )
    `);
  }
};
