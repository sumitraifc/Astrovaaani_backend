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

    await pool.query(
      `INSERT INTO app_contents (type, title, content, target, status)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         content = VALUES(content),
         target  = VALUES(target),
         status  = VALUES(status),
         title   = VALUES(title),
         updated_at = NOW()`,
      [type, title, content, target, status]
    );
  }
};
