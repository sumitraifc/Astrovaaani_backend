module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE banners (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,

        title VARCHAR(255),

        image VARCHAR(255) NOT NULL,

        redirect_url VARCHAR(255),

        type ENUM('home','offer','popup')
        DEFAULT 'home',

        status ENUM('active','inactive')
        DEFAULT 'active',

        sort_order INT DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
};