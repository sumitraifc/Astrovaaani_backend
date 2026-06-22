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
  const TITLES = {
    privacy_policy:   'Privacy Policy',
    terms_conditions: 'Terms & Conditions',
    maintenance:      'Maintenance Mode',
  };
  for (const [type, value] of Object.entries(settings)) {
    const content = typeof value === 'object' ? String(value.content ?? '') : String(value);
    const target  = typeof value === 'object' && value.target ? value.target : 'both';
    const status  = typeof value === 'object' && value.status ? value.status : 'active';
    const title   = TITLES[type] || type;
    await pool.query(
      `UPDATE app_contents SET content = ?, target = ?, status = ?, title = ?, updated_at = NOW()
       WHERE type = ? AND (meta_key IS NULL OR meta_key = '')`,
      [content, target, status, title, type]
    );
  }
};
