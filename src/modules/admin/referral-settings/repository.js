const pool = require('../../../config/db');

// ── Referral Settings ──────────────────────────────────────
exports.get = async () => {
  const [[row]] = await pool.query('SELECT * FROM referral_settings ORDER BY id DESC LIMIT 1');
  return row || null;
};

exports.update = async ({ referral_bonus }) => {
  const [[existing]] = await pool.query('SELECT id FROM referral_settings LIMIT 1');
  if (existing) {
    await pool.query('UPDATE referral_settings SET referral_bonus=?, updated_at=NOW() WHERE id=?', [referral_bonus, existing.id]);
  } else {
    await pool.query('INSERT INTO referral_settings (referral_bonus) VALUES (?)', [referral_bonus]);
  }
};

// ── Gift Amounts ───────────────────────────────────────────
exports.getGifts = async () => {
  const [rows] = await pool.query('SELECT * FROM gift_amounts ORDER BY sort_order ASC, id ASC');
  return rows;
};

exports.createGift = async ({ name, amount, image, sort_order, is_active }) => {
  const [result] = await pool.query(
    'INSERT INTO gift_amounts (name, amount, image, sort_order, is_active) VALUES (?,?,?,?,?)',
    [name, amount, image, sort_order || 0, is_active !== undefined ? is_active : 1]
  );
  return result.insertId;
};

exports.updateGift = async (id, { name, amount, image, sort_order, is_active }) => {
  const sets = ['name=?', 'amount=?', 'sort_order=?', 'is_active=?'];
  const vals = [name, amount, sort_order ?? 0, is_active !== undefined ? is_active : 1];
  if (image) { sets.push('image=?'); vals.push(image); }
  vals.push(id);
  await pool.query(`UPDATE gift_amounts SET ${sets.join(',')} WHERE id=?`, vals);
};

exports.deleteGift = async (id) => {
  await pool.query('DELETE FROM gift_amounts WHERE id=?', [id]);
};
