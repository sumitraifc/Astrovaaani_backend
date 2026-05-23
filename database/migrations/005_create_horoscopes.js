module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE horoscopes (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,

        zodiac_id INT,

        date DATE,

        type ENUM('daily','weekly','monthly','yearly'),

        lucky_number VARCHAR(10),
        lucky_color VARCHAR(50),
        lucky_time VARCHAR(50),

        love TEXT,
        career TEXT,
        money TEXT,
        health TEXT,
        personal_growth TEXT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (zodiac_id)
        REFERENCES zodiac_signs(id)
        ON DELETE CASCADE
      )
    `);
  }
};