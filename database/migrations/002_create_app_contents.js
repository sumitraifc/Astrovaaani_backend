module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE app_contents (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) DEFAULT NULL,
        target ENUM('user','astrologer','both') DEFAULT 'both',
        meta_key VARCHAR(100) DEFAULT NULL,
        title VARCHAR(255) DEFAULT NULL,
        content LONGTEXT DEFAULT NULL,
        image VARCHAR(255) DEFAULT NULL,
        status ENUM('active','inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
};
