// const db = require('../../config/db');

// exports.create = async(data)=>{
//   const [res] = await db.query(
//     "INSERT INTO users (name,email,password) VALUES (?,?,?)",
//     [data.name,data.email,data.password]
//   );
//   return {id:res.insertId,...data};
// };

// exports.findByEmail = async(email)=>{
//   const [rows] = await db.query("SELECT * FROM users WHERE email=?",[email]);
//   return rows[0];
// };


const pool = require("../../config/db");

/**
 * CREATE USER
 */
exports.create = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO users 
    (uuid, mobile, name, email, gender, dob, birth_time, birth_place, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.uuid,
      data.mobile,
      data.name,
      data.email,
      data.gender,
      data.dob,
      data.birth_time,
      data.birth_place,
      data.status
    ]
  );

  return { id: result.insertId, ...data };
};

/**
 * FIND BY MOBILE
 */
exports.findByMobile = async (mobile) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE mobile = ?",
    [mobile]
  );

  return rows[0];
};

/**
 * FIND BY ID
 */
exports.findById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  return rows[0];
};

/**
 * UPDATE PROFILE
 */
// exports.updateProfile = async (id, data) => {
//   await pool.query(
//     `UPDATE users 
//      SET name=?, gender=?, dob=?, birth_time=?, birth_place=?, email=?
//      WHERE id=?`,
//     [
//       data.name,
//       data.gender,
//       data.dob,
//       data.birth_time,
//       data.birth_place,
//       data.email,
//       id
//     ]
//   );

//   return { success: true };
// };

// exports.updateProfile = async (id, data, profileImage) => {
//   const [result] = await pool.query(
//     `UPDATE users 
//      SET 
//        name = COALESCE(?, name),
//        email = COALESCE(?, email),
//        mobile = COALESCE(?, mobile),
//        gender = COALESCE(?, gender),
//        dob = COALESCE(?, dob),
//        birth_time = COALESCE(?, birth_time),
//        birth_place = COALESCE(?, birth_place),
//        profile_image = COALESCE(?, profile_image)
//      WHERE id = ?`,
//     [
//       data.name,
//       data.email,
//       data.mobile,
//       data.gender,
//       data.dob,
//       data.birth_time,
//       data.birth_place,
//       profileImage,
//       id
//     ]
//   );

//   return {
//     success: true,
//     affectedRows: result.affectedRows
//   };
// };

exports.updateProfile = async (id, data, profileImage) => {
  const [result] = await pool.query(
    `UPDATE users 
     SET 
       name = COALESCE(?, name),
       email = COALESCE(?, email),
       mobile = COALESCE(?, mobile),
       gender = COALESCE(?, gender),
       dob = COALESCE(?, dob),
       birth_time = COALESCE(?, birth_time),
       birth_place = COALESCE(?, birth_place),
       profile_image = COALESCE(?, profile_image)
     WHERE id = ?`,
    [
      data.name || null,
      data.email || null,
      data.mobile || null,
      data.gender || null,
      data.dob || null,
      data.birth_time || null,
      data.birth_place || null,
      profileImage || null,
      id
    ]
  );

  return {
    success: true,
    affectedRows: result.affectedRows
  };
};