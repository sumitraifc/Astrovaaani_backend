const db = require("../../../config/db");

exports.getContent = async (astrologerId) => {

  const [rows] = await db.query(`
    SELECT 
      type,
      meta_key,
      title,
      content,
      image
    FROM app_contents
    WHERE status = 'active'
    AND target IN ('astrologer','both')
    ORDER BY id ASC
  `);

  // group by type (clean response)
  const result = {};

  rows.forEach(item => {
    result[item.type] = {
      meta_key: item.meta_key,
      title: item.title,
      content: item.content,
      image: item.image
    };
  });

  return result;
};