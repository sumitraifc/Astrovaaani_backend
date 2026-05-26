const db = require("../../config/db");

exports.create = async (data) => {

  const [result] = await db.query(`
    INSERT INTO astrologers
    (
      uuid,
      name,
      profile_image,
      experience,
      rating,
      total_reviews,
      languages,
      expertise,
      chat_charge,
      audio_charge,
      video_charge,
      is_online,
      status,
      about
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `,[
    data.uuid,
    data.name,
    data.profile_image,
    data.experience,
    data.rating,
    data.total_reviews,
    data.languages,
    data.expertise,
    data.chat_charge,
    data.audio_charge,
    data.video_charge,
    data.is_online,
    data.status,
    data.about
  ]);

  const [rows] = await db.query(
    "SELECT * FROM astrologers WHERE id=?",
    [result.insertId]
  );

  return rows[0];
};

exports.getAll = async () => {

  const [rows] = await db.query(`
    SELECT * FROM astrologers
    ORDER BY id DESC
  `);

  return rows;
};

// exports.getById = async (id) => {

//   const [rows] = await db.query(
//     "SELECT * FROM astrologers WHERE id=?",
//     [id]
//   );

//   return rows[0];
// };


// exports.getById = async (userId, id) => {
//   const [rows] = await db.query(
//     `
//     SELECT 
//       a.*,
//       IF(? IS NULL, 0,
//         IF(f.id IS NOT NULL, 1, 0)
//       ) AS is_favourite
//     FROM astrologers a
//     LEFT JOIN favorites f 
//       ON f.astrologer_id = a.id 
//       AND f.user_id = ?
//     WHERE a.id = ?
//     `,
//     [userId, userId, id]
//   );

//   return rows[0];
// };

exports.getById = async (userId, id) => {
  const [rows] = await db.query(
    `
    SELECT 
      a.*,

      IF(? IS NULL, 0,
        IF(f.id IS NOT NULL, 1, 0)
      ) AS is_favourite

    FROM astrologers a

    LEFT JOIN favorites f 
      ON f.astrologer_id = a.id 
      AND f.user_id = ?

    WHERE a.id = ?
    `,
    [userId, userId, id]
  );

  const data = rows[0];

  // separate simple query for expertise
  const [expertise] = await db.query(
    `
    SELECT 
      em.id,
      em.name,
      em.image
    FROM astrologer_expertise ae
    INNER JOIN expertise_master em 
      ON em.id = ae.expertise_id
    WHERE ae.astrologer_id = ?
    `,
    [id]
  );

  data.expertise = expertise || [];

  return data;
};

exports.update = async (id, data) => {

  await db.query(`
    UPDATE astrologers
    SET
      name=?,
      profile_image=?,
      experience=?,
      rating=?,
      total_reviews=?,
      languages=?,
      expertise=?,
      chat_charge=?,
      audio_charge=?,
      video_charge=?,
      is_online=?,
      about=?
    WHERE id=?
  `,[
    data.name,
    data.profile_image,
    data.experience,
    data.rating,
    data.total_reviews,
    data.languages,
    data.expertise,
    data.chat_charge,
    data.audio_charge,
    data.video_charge,
    data.is_online,
    data.about,
    id
  ]);
};

exports.changeStatus = async (id, status) => {

  await db.query(`
    UPDATE astrologers
    SET status=?
    WHERE id=?
  `,[status,id]);
};