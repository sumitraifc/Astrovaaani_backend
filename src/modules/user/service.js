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
const axios = require("axios");

/**
 * =========================
 * SEND OTP
 * =========================
 */
// exports.sendOtp = async (mobile) => {
//   if (!mobile) throw new Error("Mobile required");

//   const existing = await redis.get(`otp_limit:${mobile}`);
//   if (existing) {
//     throw new Error("OTP already sent. Try after 1 min");
//   }

//   const otp = "111111";

//   // ✅ correct ioredis syntax
//   await redis.set(`otp:${mobile}`, otp, "EX", 300);
//   await redis.set(`otp_limit:${mobile}`, "1", "EX", 60);

//   return {
//     success: true,
//     message: "OTP sent (expires in 5 min)",
//   };
// };


exports.sendOtp = async (mobile) => {
  if (!mobile) throw new Error("Mobile required");

  const existing = await redis.get(`otp_limit:${mobile}`);
  if (existing) {
    throw new Error("OTP already sent. Try after 1 min");
  }

  try {
    const url = "https://indopay.cloud/otp/newsend_otp.php";

    const response = await axios.get(url, {
      params: {
        merchant_key: "d878a2e452e6da0ba64cc50e8175b195e71b8659386577cf",
        mobile_no: mobile,
        digit: 6,
      },
    });

    console.log("OTP API Response:", response.data);

    // OTP extract from provider
    const otp = response.data?.otp;

    if (!otp) {
      throw new Error("OTP not received from provider");
    }

    // store OTP in redis
    await redis.set(`otp:${mobile}`, otp, "EX", 300);
    await redis.set(`otp_limit:${mobile}`, "1", "EX", 60);

    return {
      success: true,
      message: "OTP sent (expires in 5 min)",
    };

  } catch (err) {
    console.error("OTP ERROR:", err.message);

    throw new Error("OTP sending failed");
  }
};
/**
 * =========================
 * VERIFY OTP + LOGIN/REGISTER
 * =========================
 */
exports.verifyOtp = async (mobile, otp) => {

  if (!mobile || !otp) {
    throw new Error("Mobile & OTP required");
  }

  const storedOtp = await redis.get(`otp:${mobile}`);

  console.log("storedOtp", storedOtp);

  /**
   * OTP EXPIRED
   */
  if (!storedOtp) {
    throw new Error("OTP expired. Please resend OTP");
  }

  /**
   * INVALID OTP
   */
  if (storedOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  /**
   * FIND USER
   */
  let user = await repo.findByMobile(mobile);

  /**
   * NEW USER
   */
  if (!user) {

    // OTP remove
    await redis.del(`otp:${mobile}`);

    return {
      success: false,
      statusCode: 401,

      is_new_user: true,

      message: "User not registered. Please complete registration",

      mobile,
    };
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
    status: user.status,
  });

  /**
   * DELETE OTP
   */
  await redis.del(`otp:${mobile}`);

  return {
    success: true,
    message: "Login successful",

    is_new_user: false,

    token,

    user,
  };
};


exports.register = async (data) => {

  /**
   * CHECK USER EXISTS
   */
  const existing = await repo.findByMobile(data.mobile);

  if (existing) {
    throw new Error("User already exists");
  }

  /**
   * CREATE USER
   */
  const user = await repo.create({

    uuid: uuidv4(),

    mobile: data.mobile,

    name: data.name,

    email: data.email,

    gender: data.gender,

    dob: data.dob,

    birth_time: data.birth_time,

    birth_place: data.birth_place,

    status: "active",
  });

  /**
   * TOKEN
   */
  const token = generateToken({
    id: user.id,
    mobile: user.mobile,
    uuid: user.uuid,
    status: user.status,
  });

  return {
    success: true,
    message: "Registration successful",
    token,
    user,
  };
};
/**
 * =========================
 * UPDATE PROFILE
 * =========================
 */
exports.updateProfile = async (id, data, file) => {
  if (!id) throw new Error("User ID required");

  const profileImage = file ? file.filename : null;

  return await repo.updateProfile(id, data, profileImage);
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



//family member 

exports.addMember = async (user_id, data) => {

  const payload = {
    uuid: uuidv4(),
    user_id,
    ...data
  };

  return await repo.addMember(payload);
};

exports.getMembers = async (user_id) => {
  return await repo.getMembers(user_id);
};

exports.getMemberById = async (id, user_id) => {
  return await repo.getMemberById(id, user_id);
};

exports.deleteMember = async (id, user_id) => {
  return await repo.deleteMember(id, user_id);
};