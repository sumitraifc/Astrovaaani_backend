module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE notifications (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT DEFAULT NULL,
        astrologer_id BIGINT DEFAULT NULL,
        title VARCHAR(255) DEFAULT NULL,
        message TEXT DEFAULT NULL,
        image VARCHAR(255) DEFAULT NULL,
        target_type ENUM('all','users','astrologers','specific_user','specific_astrologer') DEFAULT NULL,
        sent_count INT DEFAULT 0,
        sent_by_admin BIGINT DEFAULT NULL,
        type ENUM('offer','message','consultation','system','push') DEFAULT NULL,
        status ENUM('read','unread') DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};
