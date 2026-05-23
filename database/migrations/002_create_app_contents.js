module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE app_contents (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,

        type VARCHAR(50) UNIQUE,

        title VARCHAR(255),

        content LONGTEXT,

        image VARCHAR(255),

        status ENUM('active','inactive') DEFAULT 'active',

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
};