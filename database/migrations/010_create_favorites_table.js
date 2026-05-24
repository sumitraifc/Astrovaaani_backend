module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE favorites (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,

        user_id BIGINT NOT NULL,
        astrologer_id BIGINT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        UNIQUE KEY unique_favorite(user_id, astrologer_id),

        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (astrologer_id) REFERENCES astrologers(id) ON DELETE CASCADE
      )
    `);
  }
};