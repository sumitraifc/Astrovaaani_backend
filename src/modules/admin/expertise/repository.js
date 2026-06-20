const pool = require('../../../config/db');

// exports.getAll = async () => {
//   const [rows] = await pool.query(`
//     SELECT em.id, em.name, em.image, em.is_active, em.sort_order, em.created_at,
//       COUNT(ae.astrologer_id) AS astrologers
//     FROM expertise_master em
//     LEFT JOIN astrologer_expertise ae ON ae.expertise_id = em.id
//     GROUP BY em.id
//     ORDER BY em.sort_order ASC
//   `);
//   return rows;
// };
exports.getAll = async () => {
  const [rows] = await pool.query(`
    SELECT em.id, em.name, em.image, em.is_active, em.sort_order, em.created_at,
      COUNT(ae.astrologer_id) AS astrologers
    FROM expertise_master em
    LEFT JOIN astrologer_expertise ae ON ae.expertise_id = em.id
    GROUP BY em.id
    ORDER BY em.sort_order ASC
  `);

  return rows.map((r) => ({
    ...r,
    image: r.image
      ? `${process.env.BASE_URL}/uploads/${r.image}`
      : null,
  }));
};
exports.create = async ({ name, image, is_active, sort_order }) => {
  const [result] = await pool.query(
    'INSERT INTO expertise_master (name, image, is_active, sort_order) VALUES (?,?,?,?)',
    [name, image || null, is_active ?? 1, sort_order || 0]
  );
  return result.insertId;
};

exports.update = async (id, { name, image, is_active, sort_order }) => {
  const sets = [];
  const vals = [];
  if (name       !== undefined) { sets.push('name = ?');       vals.push(name); }
  if (image      !== undefined) { sets.push('image = ?');      vals.push(image); }
  if (is_active  !== undefined) { sets.push('is_active = ?');  vals.push(is_active); }
  if (sort_order !== undefined) { sets.push('sort_order = ?'); vals.push(sort_order); }
  if (!sets.length) return;
  vals.push(id);
  await pool.query(`UPDATE expertise_master SET ${sets.join(', ')} WHERE id = ?`, vals);
};

exports.delete = async (id) => {
  await pool.query('DELETE FROM expertise_master WHERE id = ?', [id]);
};
