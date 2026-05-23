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