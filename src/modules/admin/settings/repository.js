const pool = require('../../../config/db');

exports.getAll = async () => {
  const [rows] = await pool.query('SELECT type, meta_key, title, content, image, target, status FROM app_contents');
  // Return as flat key→value map for backward compat
  // key = type  (unique rows like privacy_policy, terms_conditions, maintenance)
  // for support rows (multiple meta_keys) key = type_metakey
  return rows.reduce((acc, r) => {
    const key = r.meta_key ? `${r.type}_${r.meta_key}` : r.type;
    acc[key] = { content: r.content, image: r.image, title: r.title, target: r.target, status: r.status };
    return acc;
  }, {});
};

exports.upsert = async (settings) => {
  // settings = { type: content_string }  e.g. { privacy_policy: '<h2>...</h2>' }
  for (const [type, value] of Object.entries(settings)) {
    await pool.query(
      `UPDATE app_contents SET content = ?, updated_at = NOW() WHERE type = ? AND (meta_key IS NULL OR meta_key = '')`,
      [String(value), type]
    );
  }
};
