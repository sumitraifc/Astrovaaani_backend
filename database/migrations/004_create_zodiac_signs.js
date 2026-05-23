module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE zodiac_signs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        slug VARCHAR(50) UNIQUE,
        symbol VARCHAR(20),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};