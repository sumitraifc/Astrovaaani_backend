module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE orders (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,

        order_id VARCHAR(100) UNIQUE,

        user_id BIGINT,

        astrologer_name VARCHAR(100),

        consultation_type ENUM('chat','call','video'),

        price DECIMAL(10,2),

        image VARCHAR(255),

        status ENUM(
          'pending',
          'completed',
          'cancelled',
          'refunded'
        ) DEFAULT 'pending',

        start_time DATETIME NULL,
        end_time DATETIME NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};