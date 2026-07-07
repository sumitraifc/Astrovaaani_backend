exports.up = async (db) => {
    await db.query(`ALTER TABLE support_ticket_messages ADD COLUMN IF NOT EXISTS is_read TINYINT(1) DEFAULT 0`);
};
