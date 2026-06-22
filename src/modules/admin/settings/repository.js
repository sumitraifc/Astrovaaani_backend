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
  for (const [type, value] of Object.entries(settings)) {
    const content = typeof value === 'object' ? String(value.content ?? '') : String(value);
    const target  = typeof value === 'object' && value.target ? value.target : 'both';
    const status  = typeof value === 'object' && value.status  ? value.status  : 'active';
    await pool.query(
      `INSERT INTO app_contents (type, content, target, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE content = VALUES(content), target = VALUES(target), status = VALUES(status), updated_at = NOW()`,
      [type, content, target, status]
    );
  }
};
