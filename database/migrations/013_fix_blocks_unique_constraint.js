module.exports = {
  up: async (db) => {
    await db.query(`
      DELETE b1 FROM blocks b1
      INNER JOIN blocks b2
      WHERE b1.id > b2.id
        AND b1.blocker_user_id       <=> b2.blocker_user_id
        AND b1.blocker_astrologer_id <=> b2.blocker_astrologer_id
        AND b1.blocked_user_id       <=> b2.blocked_user_id
        AND b1.blocked_astrologer_id <=> b2.blocked_astrologer_id
    `).catch(() => {});

    await db.query(`
      ALTER TABLE blocks
      ADD CONSTRAINT unique_block
      UNIQUE (blocker_user_id, blocker_astrologer_id, blocked_user_id, blocked_astrologer_id)
    `).catch(() => {});
  }
};
