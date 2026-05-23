// const repo = require('./repository');
// const {hash,compare} = require('../../utils/hash');
// const {generate} = require('../../utils/jwt');

// exports.register = async(data)=>{
//   data.password = await hash(data.password);
//   const user = await repo.create(data);
//   return {token:generate({id:user.id})};
// };

// exports.login = async(data)=>{
//   const user = await repo.findByEmail(data.email);
//   if(!user) throw new Error('User not found');
//   const ok = await compare(data.password,user.password);
//   if(!ok) throw new Error('Invalid password');
//   return {token:generate({id:user.id})};
// };

const repo = require("./repository");
const redis = require("../../config/redis");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../../utils/jwt");

/**
 * =========================
 * SEND OTP
 * =========================
 */
exports.sendOtp = async (mobile) => {
  if (!mobile) throw new Error("Mobile required");

  // 🔥 prevent spam (rate limit)
  const existing = await redis.get(`otp_limit:${mobile}`);
  if (existing) {
    throw new Error("OTP already sent. Try after 1 min");
  }

  const otp = "111111"; // DEV OTP (replace with SMS API)

  // store OTP (5 min expiry)
  await redis.set(`otp:${mobile}`, otp, "EX", 300);

  // rate limit (1 min lock)
  await redis.set(`otp_limit:${mobile}`, "1", "EX", 60);

  return {
    success: true,
    message: "OTP sent (expires in 5 min)",
  };
};

/**
 * =========================
 * VERIFY OTP + LOGIN/REGISTER
 * =========================
 */
exports.verifyOtp = async (mobile, otp) => {
  if (!mobile || !otp) throw new Error("Mobile & OTP required");

  const storedOtp = await redis.get(`otp:${mobile}`);

  if (!storedOtp) {
    throw new Error("OTP expired. Please resend OTP");
  }

  if (storedOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  let user = await repo.findByMobile(mobile);

  /**
   * NEW USER CREATE
   */
  if (!user) {
    user = await repo.create({
      uuid: uuidv4(),
      mobile,
      name: `User_${Math.floor(Math.random() * 9999)}`,
      email: null,
      gender: null,
      dob: null,
      birth_time: null,
      birth_place: null,
      profile_image: null,
      status: "active",
      is_verified: true,
    });
  }

  /**
   * BLOCK CHECK
   */
  if (user.status === "blocked") {
    throw new Error("User is blocked");
  }

  /**
   * JWT TOKEN
   */
  const token = generateToken({
    id: user.id,
    mobile: user.mobile,
    uuid: user.uuid,
  });

  /**
   * CLEAN OTP AFTER SUCCESS
   */
  await redis.del(`otp:${mobile}`);

  return {
    success: true,
    message: "Login successful",
    token,
    user,
  };
};

/**
 * =========================
 * UPDATE PROFILE
 * =========================
 */
exports.updateProfile = async (id, data) => {
  if (!id) throw new Error("User ID required");

  return await repo.updateProfile(id, data);
};

/**
 * =========================
 * GET PROFILE
 * =========================
 */
exports.getUser = async (id) => {
  if (!id) throw new Error("User ID required");

  const user = await repo.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    user,
  };
};