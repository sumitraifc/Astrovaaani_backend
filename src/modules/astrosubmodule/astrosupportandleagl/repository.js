// const db = require("../../../config/db");

// exports.getContent = async () => {

//   const [rows] = await db.query(`
//     SELECT 
//       type,
//       meta_key,
//       title,
//       content,
//       image
//     FROM app_contents
//     WHERE status = 'active'
//     AND target IN ('astrologer','both')
//     ORDER BY id ASC
//   `);

//   const result = {};

//   rows.forEach(item => {

//     // create type bucket
//     if (!result[item.type]) {
//       result[item.type] = {};
//     }

//     // 🔥 ONLY SUPPORT FIX
//     if (item.type === "support") {

//       if (!item.meta_key) return; // skip null support keys

//       result = {
//         title: item.title,
//         content: item.content,
//         image: item.image
//       };

//     } else {

//       // other types keep same logic
//       const key = item.meta_key || "main";

//       resul[item.type][key] = {
//         title: item.title,
//         content: item.content,
//         image: item.image
//       };
//     }

//   });

//   return result;
// };

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

    const type = item.type;

    // SUPPORT
    if (type === "support") {

      if (!result.support) result.support = [];

      result.support.push({
        key: item.meta_key,
        title: item.title,
        url: item.content,
        // image: item.image
         image: item.image
  ? `${process.env.BASE_URL}/uploads/${item.image}`
  : null
      });

      return;
    }

    // FAQ
    if (type === "faq") {

      if (!result.faq) {
        result.faq = {
          title: "FAQ",
          content: []
        };
      }

      result.faq.content.push({
        question: item.title,
        answer: item.content
      });

      return;
    }

    // OTHERS
    if (!result[type]) {
      result[type] = {
        title: item.title,
        content: item.content,
        // image: item.image
         image: item.image
  ? `${process.env.BASE_URL}/uploads/${item.image}`
  : null
      };
    }

  });

  // 🔥 IMPORTANT: ONLY RAW DATA RETURN
  return result;
};