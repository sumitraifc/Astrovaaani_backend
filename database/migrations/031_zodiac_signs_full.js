module.exports = {
  up: async (db) => {
    // Drop and recreate with full schema
    await db.query(`DROP TABLE IF EXISTS zodiac_signs`);

    await db.query(`
      CREATE TABLE zodiac_signs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) DEFAULT NULL,
        slug VARCHAR(50) DEFAULT NULL,
        symbol VARCHAR(20) DEFAULT NULL,
        image VARCHAR(255) DEFAULT NULL,
        symbol_image VARCHAR(255) DEFAULT NULL,
        color VARCHAR(20) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
