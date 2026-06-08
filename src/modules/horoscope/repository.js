const db = require("../../config/db");

exports.getZodiacs = async () => {
  const [rows] = await db.query(`SELECT * FROM zodiac_signs`);
  return rows;
};

exports.getHoroscope = async (zodiacId, type) => {
  const [rows] = await db.query(
    `SELECT * FROM horoscopes
     WHERE zodiac_id=? AND type=?
     ORDER BY date DESC`,
    [zodiacId, type]
  );

  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM horoscopes WHERE id=?`,
    [id]
  );

  return rows[0];
};

exports.create = async (data) => {
  const [res] = await db.query(
    `INSERT INTO horoscopes
    (zodiac_id,date,type,lucky_number,lucky_color,lucky_time,love,career,money,health,personal_growth)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      data.zodiac_id,
      data.date,
      data.type,
      data.lucky_number,
      data.lucky_color,
      data.lucky_time,
      data.love,
      data.career,
      data.money,
      data.health,
      data.personal_growth
    ]
  );

  return res;
};

exports.update = async (id, data) => {
  await db.query(
    `UPDATE horoscopes SET
      lucky_number=?,
      lucky_color=?,
      lucky_time=?,
      love=?,
      career=?,
      money=?,
      health=?,
      personal_growth=?
     WHERE id=?`,
    [
      data.lucky_number,
      data.lucky_color,
      data.lucky_time,
      data.love,
      data.career,
      data.money,
      data.health,
      data.personal_growth,
      id
    ]
  );

  return true;
};

exports.findByDate = async (
  zodiac_id,
  date,
  type
) => {

  const [rows] = await db.query(
    `
    SELECT *
    FROM horoscopes
    WHERE zodiac_id = ?
    AND date = ?
    AND type = ?
    LIMIT 1
    `,
    [
      zodiac_id,
      date,
      type
    ]
  );

  return rows[0];
};

exports.createHoroscope = async (data) => {

  const [result] = await db.query(
    `
    INSERT INTO horoscopes
    (
      zodiac_id,
      date,
      type,

      lucky_number,
      lucky_color,
      lucky_time,
      lucky_direction,

      love,
      love_status,

      career,
      career_status,

      money,
      finance_status,

      health,
      health_status,

      personal_growth,
      personal_growth_status,

      family,
      education,
      travel,

      overview,
      tip_of_the_day
    )
    VALUES
    (
      ?,?,?,?,?,?,
      ?,?,?,?,
      ?,?,?,?,
      ?,?,?,?,
      ?,?,?,?,?
    )
    `,
    [
      data.zodiac_id,
      data.date,
      data.type,

      data.lucky_number,
      data.lucky_color,
      data.lucky_time,
      data.lucky_direction,

      data.love,
      data.love_status,

      data.career,
      data.career_status,

      data.money,
      data.finance_status,

      data.health,
      data.health_status,

      data.personal_growth,
      data.personal_growth_status,

      data.family,
      data.education,
      data.travel,

      data.overview,
      data.tip_of_the_day
    ]
  );

  return result;
};