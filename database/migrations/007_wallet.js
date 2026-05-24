module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE wallet (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,

        user_id BIGINT UNIQUE,

        balance DECIMAL(10,2) DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE wallet_transactions (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,

        user_id BIGINT,

        type ENUM('credit','debit','refund'),

        amount DECIMAL(10,2),

        reason VARCHAR(255),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};