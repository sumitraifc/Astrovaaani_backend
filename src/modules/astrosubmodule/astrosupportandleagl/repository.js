const db = require("../../../config/db");

exports.getContent = async () => {

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

  const result = {};

  rows.forEach(item => {

    // create type bucket
    if (!result[item.type]) {
      result[item.type] = {};
    }

    // 🔥 ONLY SUPPORT FIX
    if (item.type === "support") {

      if (!item.meta_key) return; // skip null support keys

      result[item.type][item.meta_key] = {
        title: item.title,
        content: item.content,
        image: item.image
      };

    } else {

      // other types keep same logic
      const key = item.meta_key || "main";

      result[item.type][key] = {
        title: item.title,
        content: item.content,
        image: item.image
      };
    }

  });

  return result;
};