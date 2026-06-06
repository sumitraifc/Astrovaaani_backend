const pool = require('../../../config/db');

exports.getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM banners ORDER BY sort_order ASC');
  return rows;
};

exports.create = async ({ title, description, image, redirect_url, type, status, sort_order }) => {
  const [result] = await pool.query(
    'INSERT INTO banners (title, description, image, redirect_url, type, status, sort_order) VALUES (?,?,?,?,?,?,?)',
    [title, description || null, image, redirect_url || null, type || 'home', status || 'active', sort_order || 0]
  );
  return result.insertId;
};

exports.update = async (id, fields) => {
  const allowed = ['title', 'description', 'image', 'redirect_url', 'type', 'status', 'sort_order'];
  const sets = [];
  const vals = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) { sets.push(`${key} = ?`); vals.push(fields[key]); }
  }
  if (!sets.length) return;
  vals.push(id);
  await pool.query(`UPDATE banners SET ${sets.join(', ')} WHERE id = ?`, vals);
};

exports.delete = async (id) => {
  await pool.query('DELETE FROM banners WHERE id = ?', [id]);
};
