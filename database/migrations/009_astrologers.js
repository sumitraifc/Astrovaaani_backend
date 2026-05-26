module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE astrologers (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,

        uuid VARCHAR(50) UNIQUE,

        name VARCHAR(100) NOT NULL,

        profile_image VARCHAR(255),

        experience INT DEFAULT 0,

        rating DECIMAL(2,1) DEFAULT 0,

        total_reviews INT DEFAULT 0,

        languages VARCHAR(255),

        chat_charge DECIMAL(10,2) DEFAULT 0,

        audio_charge DECIMAL(10,2) DEFAULT 0,

        video_charge DECIMAL(10,2) DEFAULT 0,

        is_online BOOLEAN DEFAULT FALSE,

        status ENUM(
          'active',
          'inactive',
          'blocked'
        ) DEFAULT 'active',

        about TEXT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
};