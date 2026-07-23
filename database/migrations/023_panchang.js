module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS panchang (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        day VARCHAR(20) DEFAULT NULL,
        tithi_name VARCHAR(100) DEFAULT NULL,
        tithi_description TEXT DEFAULT NULL,
        tithi_status VARCHAR(50) DEFAULT NULL,
        nakshatra_name VARCHAR(100) DEFAULT NULL,
        nakshatra_description TEXT DEFAULT NULL,
        nakshatra_status VARCHAR(50) DEFAULT NULL,
        yoga_name VARCHAR(100) DEFAULT NULL,
        yoga_description TEXT DEFAULT NULL,
        yoga_status VARCHAR(50) DEFAULT NULL,
        karan_name VARCHAR(100) DEFAULT NULL,
        karan_description TEXT DEFAULT NULL,
        karan_status VARCHAR(50) DEFAULT NULL,
        rahu_kaal_time VARCHAR(50) DEFAULT NULL,
        rahu_kaal_status VARCHAR(50) DEFAULT NULL,
        abhijit_muhurat_time VARCHAR(50) DEFAULT NULL,
        abhijit_muhurat_status VARCHAR(50) DEFAULT NULL,
        amrit_kaal_time VARCHAR(50) DEFAULT NULL,
        amrit_kaal_status VARCHAR(50) DEFAULT NULL,
        auspicious VARCHAR(50) DEFAULT NULL,
        overall_day_status VARCHAR(50) DEFAULT NULL,
        overall_description TEXT DEFAULT NULL,
        sunrise VARCHAR(20) DEFAULT NULL,
        sunset VARCHAR(20) DEFAULT NULL,
        moonrise VARCHAR(20) DEFAULT NULL,
        moonset VARCHAR(20) DEFAULT NULL,
        paksha VARCHAR(100) DEFAULT NULL,
        hindu_month VARCHAR(100) DEFAULT NULL,
        month VARCHAR(50) DEFAULT NULL,
        year INT DEFAULT NULL,
        festivals JSON DEFAULT NULL,
        vrat JSON DEFAULT NULL,
        shubh_works JSON DEFAULT NULL,
        avoid_works JSON DEFAULT NULL,
        third_party_id VARCHAR(100) DEFAULT NULL,
        month_overall_energy VARCHAR(50) DEFAULT NULL,
        total_days_in_month INT DEFAULT NULL,
        total_festivals INT DEFAULT NULL,
        important_festivals LONGTEXT DEFAULT NULL,
        best_days LONGTEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS panchang_month_dates (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        month VARCHAR(20) DEFAULT NULL,
        year INT DEFAULT NULL,
        date DATE DEFAULT NULL,
        day VARCHAR(20) DEFAULT NULL,
        tithi VARCHAR(100) DEFAULT NULL,
        nakshatra VARCHAR(100) DEFAULT NULL,
        overall_status VARCHAR(50) DEFAULT NULL,
        festivals JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
