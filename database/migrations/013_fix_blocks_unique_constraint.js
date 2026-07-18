const pool = require('../../src/config/db');

async function up() {
  // Remove duplicate rows first (keep lowest id)
  await pool.query(`
    DELETE b1 FROM blocks b1
    INNER JOIN blocks b2
    WHERE b1.id > b2.id
      AND b1.blocker_user_id       <=> b2.blocker_user_id
      AND b1.blocker_astrologer_id <=> b2.blocker_astrologer_id
      AND b1.blocked_user_id       <=> b2.blocked_user_id
      AND b1.blocked_astrologer_id <=> b2.blocked_astrologer_id
  `);
  console.log('✅ Duplicate blocks removed');

  // Add UNIQUE constraint if not exists
  await pool.query(`
    ALTER TABLE blocks
    ADD CONSTRAINT unique_block
    UNIQUE (blocker_user_id, blocker_astrologer_id, blocked_user_id, blocked_astrologer_id)
  `).catch(err => {
    if (err.code === 'ER_DUP_KEYNAME') {
      console.log('ℹ️  unique_block constraint already exists, skipping');
    } else {
      throw err;
    }
  });
  console.log('✅ blocks unique constraint added');
}

up().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
