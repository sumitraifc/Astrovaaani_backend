const pool = require('../../../config/db');

const POLICY_TYPES = {
  privacy_policy:           'Privacy Policy',
  terms_conditions:         'Terms & Conditions',
  refund_cancellation:      'Refund & Cancellation Policy',
  community_guidelines:     'Community Guidelines',
  disclaimer:               'Disclaimer',
  account_deletion_policy:  'Account Deletion Policy',
  contact_us:               'Contact Us',
  maintenance:              'Maintenance Mode',
};

exports.getAll = async () => {
  const [rows] = await pool.query('SELECT type, meta_key, title, content, image, target, status FROM app_contents');
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
    const status  = typeof value === 'object' && value.status ? value.status : 'active';
    const title   = POLICY_TYPES[type] || type;

    const [[existing]] = await pool.query('SELECT id FROM app_contents WHERE type = ?', [type]);
    if (existing) {
      await pool.query(
        'UPDATE app_contents SET content=?, target=?, status=?, title=?, updated_at=NOW() WHERE id=?',
        [content, target, status, title, existing.id]
      );
    } else {
      await pool.query(
        'INSERT INTO app_contents (type, title, content, target, status) VALUES (?, ?, ?, ?, ?)',
        [type, title, content, target, status]
      );
    }
  }
};
