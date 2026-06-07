
const repo = require("./repository");
const { v4: uuidv4 } = require("uuid");
// exports.saveStep = async (step, id, payload) => {

//   let astro = null;

//   // STEP 1 CREATE
//   if (step === 1) {

//     const newId = await repo.create({

//       phone: payload.phone,

//       name: payload.name,

//       gender: payload.gender,

//       dob: payload.dob,

//       experience: payload.experience,

//       languages: payload.languages,

//       profile_image: payload.profile_image,

//       id_proof: payload.id_proof,

//       about: payload.about,

//       registration_step: 2,

//       registration_completed: 0,
//     });

//     return {
//       success: true,
//       id: newId,
//       nextStep: 2
//     };
//   }

//   astro = await repo.findById(id);

//   if (!astro) {
//     throw new Error("Astrologer not found");
//   }

//   if (astro.registration_step !== step) {
//     return {
//       success: false,
//       message: `You are on step ${astro.registration_step}`
//     };
//   }

//   let updateData = {
//     ...payload,
//     registration_step: step + 1
//   };

//   // FINAL SUBMIT
//   if (step === 5) {

//     updateData.registration_completed = 1;

//     updateData.registration_step = 5;

//     updateData.approval_status = "pending";
//   }

//   await repo.update(id, updateData);

//   return {
//     success: true,
//     nextStep: updateData.registration_step,
//     completed: step === 5
//   };
// };

exports.saveStep = async (step, id, payload) => {

  let astro = null;

  // ======================
  // STEP 1 CREATE
  // ======================
  if (step === 1) {
const existing = await repo.findByMobile(payload.phone);

if (existing) {
  throw new Error("This mobile already registered");
}
    const newId = await repo.create({
          uuid: uuidv4(),
      phone: payload.phone,
      name: payload.name,
      gender: payload.gender,
      dob: payload.dob,
      experience: payload.experience,
      languages: payload.languages,
      profile_image: payload.profile_image,
      id_proof: payload.id_proof,
      about: payload.about,

      registration_step: 2,
      registration_completed: 0,

      // 🔥 IMPORTANT FIX
      approval_status: "resume"
    });

    return {
      success: true,
      id: newId,
      nextStep: 2
    };
  }

  // ======================
  // FIND ASTROLOGER
  // ======================
  astro = await repo.findById(id);

  if (!astro) {
    throw new Error("Astrologer not found");
  }

  const stepStatusKey = `step${step}_status`;
  const isRejected = astro[stepStatusKey] === "rejected";

  // Allow resubmit if step was rejected, else check registration_step
  if (!isRejected && astro.registration_step !== step) {
    return {
      success: false,
      message: `You are on step ${astro.registration_step}`
    };
  }

  // ======================
  // UPDATE DATA
  // ======================
  let updateData = {
    ...payload,
    [stepStatusKey]: "pending",
    approval_status: "resume"
  };

  if (step === 5) {
    // Final submit
    updateData.registration_completed = 1;
    updateData.registration_step = 5;
    updateData.approval_status = "pending";
  } else if (isRejected) {
    // Resubmit: stay on same step until admin re-reviews
    updateData.registration_step = step;
  } else {
    // Normal flow
    updateData.registration_step = step + 1;
  }

  await repo.update(id, updateData);

  return {
    success: true,
    nextStep: updateData.registration_step,
    completed: step === 5,
    status: updateData.approval_status
  };
};

exports.getStatus = async (id) => {
  return await repo.findById(id);
};

exports.getProfile = async (astrologerId) => {
  return await repo.getProfile(astrologerId);
};

exports.uploadDocument = async (astrologerId, data) => {
  return await repo.uploadDocument(astrologerId, data);
};

exports.getTimeline = async (astrologerId) => {
  return await repo.getTimeline(astrologerId);
};