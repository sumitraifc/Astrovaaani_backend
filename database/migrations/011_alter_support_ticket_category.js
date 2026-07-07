exports.up = async (db) => {
    await db.query(`ALTER TABLE support_tickets MODIFY COLUMN category VARCHAR(100) DEFAULT 'technical'`);
};
