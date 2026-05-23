module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        
        uuid VARCHAR(50) UNIQUE,

        name VARCHAR(100),
        email VARCHAR(150) UNIQUE,

        mobile VARCHAR(15) UNIQUE,

        gender ENUM('male','female','other') DEFAULT NULL,

        dob DATE,
        birth_time TIME,
        birth_place VARCHAR(150),

        profile_image VARCHAR(255) DEFAULT NULL,

        password VARCHAR(255),

        status ENUM('active','blocked') DEFAULT 'active',

        is_verified BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
};