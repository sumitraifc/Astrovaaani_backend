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
const astroRepo = require("../astrosubmodule/astrologer/repository");
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

//   try {
//     const url = "https://indopay.cloud/otp/newsend_otp.php";

//     const response = await axios.get(url, {
//       params: {
//         merchant_key: "d878a2e452e6da0ba64cc50e8175b195e71b8659386577cf",
//         mobile_no: mobile,
//         digit: 6,
//       },
//     });

//     console.log("OTP API Response:", response.data);

//     // OTP extract from provider
//     const otp = response.data?.otp;

//     if (!otp) {
//       throw new Error("OTP not received from provider");
//     }

//     // store OTP in redis
//     await redis.set(`otp:${mobile}`, otp, "EX", 300);
//     await redis.set(`otp_limit:${mobile}`, "1", "EX", 60);

//     return {
//       success: true,
//       message: "OTP sent (expires in 5 min)",
//     };

//   } catch (err) {
//     console.error("OTP ERROR:", err.message);

//     throw new Error("OTP sending failed");
//   }
// };

exports.sendOtp = async (mobile, role) => {

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

    const otp = response.data?.otp;

    if (!otp) {
      throw new Error("OTP not received from provider");
    }

    await redis.set(`otp:${mobile}`, otp, "EX", 300);
    await redis.set(`otp_limit:${mobile}`, "1", "EX", 60);

    // 🔥 ADD ROLE ONLY (NO MESSAGE CHANGE)
    if (role) {
      await redis.set(`otp_role:${mobile}`, role, "EX", 300);
    }

    return {
      success: true,
      message: "OTP sent (expires in 5 min)",
      time: 300,
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
// exports.verifyOtp = async (mobile, otp) => {

//   if (!mobile || !otp) {
//     throw new Error("Mobile & OTP required");
//   }

//   const storedOtp = await redis.get(`otp:${mobile}`);

//   console.log("storedOtp", storedOtp);

//   /**
//    * OTP EXPIRED
//    */
//   if (!storedOtp) {
//     throw new Error("OTP expired. Please resend OTP");
//   }

//   /**
//    * INVALID OTP
//    */
//   if (storedOtp !== otp) {
//     throw new Error("Invalid OTP");
//   }

//   /**
//    * FIND USER
//    */
//   let user = await repo.findByMobile(mobile);

//   /**
//    * NEW USER
//    */
//   if (!user) {

//     // OTP remove
//     await redis.del(`otp:${mobile}`);

//     return {
//       success: false,
//       statusCode: 401,

//       is_new_user: true,

//       message: "User not registered. Please complete registration",

//       mobile,
//     };
//   }

//   /**
//    * BLOCK CHECK
//    */
//   if (user.status === "blocked") {
//     throw new Error("User is blocked");
//   }

//   /**
//    * JWT TOKEN
//    */
//   const token = generateToken({
//     id: user.id,
//     mobile: user.mobile,
//     uuid: user.uuid,
//     status: user.status,
//   });

//   /**
//    * DELETE OTP
//    */
//   await redis.del(`otp:${mobile}`);

//   return {
//     success: true,
//     message: "Login successful",

//     is_new_user: false,

//     token,

//     user,
//   };
// };

// exports.verifyOtp = async (mobile, otp , fcm_token = null) => {

//   if (!mobile || !otp) {
//     throw new Error("Mobile & OTP required");
//   }

//   const storedOtp = await redis.get(`otp:${mobile}`);

//   console.log("storedOtp", storedOtp);

//   if (!storedOtp) {
//     throw new Error("OTP expired. Please resend OTP");
//   }

//   if (storedOtp !== otp) {
//     throw new Error("Invalid OTP");
//   }

//   // 🔥 ROLE FETCH (NEW ADDITION ONLY)
//   const role = await redis.get(`otp_role:${mobile}`);

//   let user;

//   /**
//    * FIND USER (USER TABLE)
//    */
//   if (!role || role === "user") {
//     user = await repo.findByMobile(mobile);
//   }

//   /**
//    * FIND ASTROLOGER (ASTROLOGER TABLE)
//    */

//   if (role === "astrologer") {
//     user = await astroRepo.findByMobile(mobile);
//   }

  
//   if (!user) {

//     await redis.del(`otp:${mobile}`);
//     await redis.del(`otp_role:${mobile}`);

//     return {
//       success: false,
//       statusCode: 401,

//       is_new_user: true,
//       nextStep: 1,
//       message: "User not registered. Please complete registration",

//       mobile,
//     };
//   }

// //   if (role === "astrologer") {

// //   if (!user.registration_completed) {

// //     return {
// //       success: true,
// //       is_new_user: false,

// //       astrologer_id: user.id,

// //       registration_incomplete: true,

// //       nextStep: user.registration_step,

// //       message: `Continue registration from step ${user.registration_step}`
// //     };
// //   }

// //   if (user.approval_status === "pending") {

// //     return {
// //       success: true,
// //       astrologer_id: user.id,
// //       approval_status: "pending",
// //       message: "Profile under review"
// //     };
// //   }
// // }
//   /**
//    * BLOCK CHECK
//    */
//   if (user.status === "blocked") {
//     throw new Error("User is blocked");
//   }
// // SAVE FCM TOKEN

// if (fcm_token) {

//   if (role === "astrologer") {

//     await astroRepo.update(user.id, {
//       fcm_token,
      
//     });

//   } else {

//     await repo.update(user.id, {
//       fcm_token,
      
//     });
//   }

//   user.fcm_token = fcm_token;
 
// }
//   const token = generateToken({
//     id: user.id,
//     mobile: user.mobile,
//     uuid: user.uuid,
//     status: user.status,
//     role: role || "user"
//   });

//   await redis.del(`otp:${mobile}`);
//   await redis.del(`otp_role:${mobile}`);

//   return {
//     success: true,
//     message: "Login successful",

//     is_new_user: false,

//     token,

//     user,
//   };
// };


exports.verifyOtp = async (mobile, otp, fcm_token = null) => {

  if (!mobile || !otp) {
    throw new Error("Mobile & OTP required");
  }

  const storedOtp = await redis.get(`otp:${mobile}`);

  if (!storedOtp) {
    throw new Error("OTP expired. Please resend OTP");
  }

  if (storedOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  const role = await redis.get(`otp_role:${mobile}`) || "user";

  let user;

  // ======================
  // FIND USER / ASTROLOGER
  // ======================
  if (role === "astrologer") {
    user = await astroRepo.findByMobile(mobile);
  } else {
    user = await repo.findByMobile(mobile);
  }

  // ======================
  // NOT FOUND USER
  // ======================
  if (!user) {

    await redis.del(`otp:${mobile}`);
    await redis.del(`otp_role:${mobile}`);

    return {
      // success: false,
      statusCode: 401,
      is_new_user: true,
      nextStep: role === "astrologer" ? 1 : null,
      message: "User not registered. Please complete registration",
      mobile,
    };
  }

  // ======================
  // NORMAL USER LOGIN (SIMPLE)
  // ======================
  if (role !== "astrologer") {

    const token = generateToken({
      id: user.id,
      mobile: user.mobile,
      role: "user"
    });

    if (fcm_token) {
      await repo.update(user.id, { fcm_token });
    }

    await redis.del(`otp:${mobile}`);
    await redis.del(`otp_role:${mobile}`);

    return {
      success: true,
      message: "Login successful",
      token,
      user
    };
  }

  // ======================
  // ASTROLOGER FLOW (IMPORTANT FIX)
  // ======================

  // ❌ REJECTED → BLOCK LOGIN
  if (user.approval_status === "rejected") {
    return {
      // success: false,
      statusCode: 403,
      message: "Your profile is rejected. Please register with another number."
    };
  }

  // ⛔ NOT APPROVED YET → NO FULL LOGIN TOKEN
  if (user.approval_status !== "approved") {

    if (fcm_token) {
      await astroRepo.update(user.id, { fcm_token });
    }

    await redis.del(`otp:${mobile}`);
    await redis.del(`otp_role:${mobile}`);

    return {
      success: true,
      statusCode: 401,
      message: "Registration in progress / under review",
      login_blocked: true,

      astrologer_id: user.id,
      approval_status: user.approval_status,
      registration_step: user.registration_step,
      registration_completed: user.registration_completed,

      nextStep: user.registration_step,
      user

    };
  }

  // ======================
  // ONLY APPROVED → LOGIN ALLOWED
  // ======================

  if (fcm_token) {
    await astroRepo.update(user.id, { fcm_token });
  }

  const token = generateToken({
    id: user.id,
    mobile: user.mobile,
    role: "astrologer",
    status: "approved"
  });

  await redis.del(`otp:${mobile}`);
  await redis.del(`otp_role:${mobile}`);

  return {
    
    success: true,
    message: "Login successful",
    token,
    user,
    approval_status: user.approval_status,
    registration_step: user.registration_step,
    registration_completed: user.registration_completed
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