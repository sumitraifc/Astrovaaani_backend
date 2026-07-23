module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE horoscopes (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        zodiac_id INT DEFAULT NULL,
        date DATE DEFAULT NULL,
        type ENUM('daily','weekly','monthly','yearly') DEFAULT NULL,
        lucky_number VARCHAR(10) DEFAULT NULL,
        lucky_color VARCHAR(50) DEFAULT NULL,
        lucky_time VARCHAR(50) DEFAULT NULL,
        love TEXT DEFAULT NULL,
        career TEXT DEFAULT NULL,
        money TEXT DEFAULT NULL,
        health TEXT DEFAULT NULL,
        personal_growth TEXT DEFAULT NULL,
        family TEXT DEFAULT NULL,
        education TEXT DEFAULT NULL,
        travel TEXT DEFAULT NULL,
        overview TEXT DEFAULT NULL,
        lucky_direction VARCHAR(100) DEFAULT NULL,
        tip_of_the_day TEXT DEFAULT NULL,
        love_status VARCHAR(50) DEFAULT NULL,
        career_status VARCHAR(50) DEFAULT NULL,
        health_status VARCHAR(50) DEFAULT NULL,
        finance_status VARCHAR(50) DEFAULT NULL,
        personal_growth_status VARCHAR(50) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
