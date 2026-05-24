module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE notifications (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,

        user_id BIGINT,

        title VARCHAR(255),

        message TEXT,

        type ENUM(
          'offer',
          'message',
          'consultation',
          'system'
        ),

        status ENUM('read','unread')
        DEFAULT 'unread',

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};