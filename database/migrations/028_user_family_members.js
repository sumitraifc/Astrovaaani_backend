module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_family_members (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(100) DEFAULT NULL,
        user_id BIGINT DEFAULT NULL,
        name VARCHAR(100) DEFAULT NULL,
        relation VARCHAR(50) DEFAULT NULL,
        gender ENUM('male','female','other') DEFAULT NULL,
        dob DATE DEFAULT NULL,
        birth_time TIME DEFAULT NULL,
        birth_place VARCHAR(150) DEFAULT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
};
