const pool = require('../../../config/db');

exports.get = async () => {
  const [[row]] = await pool.query('SELECT * FROM referral_settings ORDER BY id DESC LIMIT 1');
  return row || null;
};

exports.update = async (data) => {
  const { referral_bonus, gift_amount, gift_image } = data;
  const [[existing]] = await pool.query('SELECT id FROM referral_settings LIMIT 1');
  if (existing) {
    const sets = ['referral_bonus=?', 'gift_amount=?', 'updated_at=NOW()'];
    const vals = [referral_bonus, gift_amount];
    if (gift_image !== undefined) { sets.push('gift_image=?'); vals.push(gift_image); }
    vals.push(existing.id);
    await pool.query(`UPDATE referral_settings SET ${sets.join(',')} WHERE id=?`, vals);
  } else {
    await pool.query(
      'INSERT INTO referral_settings (referral_bonus, gift_amount, gift_image) VALUES (?,?,?)',
      [referral_bonus, gift_amount, gift_image || null]
    );
  }
};
