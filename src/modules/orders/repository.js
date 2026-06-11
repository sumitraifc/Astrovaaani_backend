const db = require("../../config/db");

exports.create = async (data) => {
  const [result] = await db.query(
    `
    INSERT INTO orders
    (
      order_id,
      user_id,
      astrologer_name,
      consultation_type,
      price,
      image,
      status
    )
    VALUES (?,?,?,?,?,?,?)
  `,
    [
      `ORD${Date.now()}`,
      data.user_id,
      data.astrologer_name,
      data.consultation_type,
      data.price,
      data.image,
      data.status
    ]
  );

  const [rows] = await db.query(
    "SELECT * FROM orders WHERE id=?",
    [result.insertId]
  );

  return rows[0];
};

// exports.getAll = async (userId) => {
//   const [rows] = await db.query(
//     "SELECT * FROM orders WHERE user_id=? ORDER BY id DESC",
//     [userId]
//   );

//   return rows;
// };

exports.getAll = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT 
      o.*,

      -- Astrologer basic info
      a.name AS astrologer_name,
      a.profile_image AS astrologer_image,
      a.rating AS astrologer_rating,
      a.experience AS astrologer_experience,
      a.languages AS astrologer_languages,
      a.expertise AS astrologer_expertise,
      a.is_online AS astrologer_is_online,

      -- Favourite flag (TRUE / FALSE)
      CASE 
        WHEN f.id IS NOT NULL THEN TRUE 
        ELSE FALSE 
      END AS is_favourite

    FROM orders o

    LEFT JOIN astrologers a 
      ON a.id = o.astrologer_id

    LEFT JOIN favorites f 
      ON f.astrologer_id = o.astrologer_id 
      AND f.user_id = ?

    WHERE o.user_id = ?

    ORDER BY o.id DESC
    `,
    [userId, userId]
  );

  return rows;
};

// exports.getById = async (userId, id) => {
//   const [rows] = await db.query(
//     "SELECT * FROM orders WHERE id=? AND user_id=?",
//     [id, userId]
//   );

//   return rows[0];
// };

exports.getById = async (userId, id) => {
  const [rows] = await db.query(
    `
    SELECT 
      -- ORDER DETAILS
      o.id AS order_id,
      o.order_id AS order_no,
      o.user_id,
      o.consultation_type,
      o.price,
      o.status AS order_status,
      o.start_time,
      o.end_time,
      TIMESTAMPDIFF(MINUTE, o.start_time, o.end_time) AS duration_minutes,
      o.created_at,

      -- ASTROLOGER DETAILS
      a.id AS astrologer_id,
      a.uuid,
      a.name AS astrologer_name,
      a.profile_image,
      a.experience,
      a.rating,
      a.total_reviews,
      a.languages,
      a.expertise,
      a.chat_charge,
      a.audio_charge,
      a.video_charge,
      a.is_online,
      a.status AS astrologer_status,
      a.about

    FROM orders o
    LEFT JOIN astrologers a ON a.id = o.astrologer_id
    WHERE o.id = ? AND o.user_id = ?
    `,
    [id, userId]
  );

  return rows[0];
};