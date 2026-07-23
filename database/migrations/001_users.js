module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(50) DEFAULT NULL,
        name VARCHAR(100) DEFAULT NULL,
        email VARCHAR(255) DEFAULT NULL,
        mobile VARCHAR(15) DEFAULT NULL,
        gender ENUM('male','female','other') DEFAULT NULL,
        dob DATE DEFAULT NULL,
        birth_time TIME DEFAULT NULL,
        birth_place VARCHAR(150) DEFAULT NULL,
        profile_image VARCHAR(255) DEFAULT NULL,
        password VARCHAR(255) DEFAULT NULL,
        status ENUM('active','blocked') DEFAULT 'active',
        is_verified TINYINT(1) DEFAULT 0,
        fcm_token TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
};
