// const jwt = require('jsonwebtoken');
// exports.generate = (payload)=>jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'7d'});




const jwt = require("jsonwebtoken");

/**
 * GENERATE TOKEN
 */
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      uuid: user.uuid,
      mobile: user.mobile,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * VERIFY TOKEN
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};