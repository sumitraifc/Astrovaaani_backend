
const repo = require("./repository");
const { v4: uuidv4 } = require("uuid");


// exports.saveStep = async (step, id, payload) => {

//   let astro = null;

//   // ======================
//   // STEP 1 CREATE
//   // ======================
//   if (step === 1) {
// const existing = await repo.findByMobile(payload.phone);

// if (existing) {
//   throw new Error("This mobile already registered");
// }
//     const newId = await repo.create({
//           uuid: uuidv4(),
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

//       // 🔥 IMPORTANT FIX
//       approval_status: "resume",
//       step1_status: "pending"
//     });

//     return {
//       success: true,
//       id: newId,
//       nextStep: 2,
//       completed: false,
//       step1_status: "pending"
//     };
//   }

//   // ======================
//   // FIND ASTROLOGER
//   // ======================
//   astro = await repo.findById(id);

//   if (!astro) {
//     throw new Error("Astrologer not found");
//   }

//   const stepStatusKey = `step${step}_status`;
//   const isRejected = astro[stepStatusKey] === "rejected";

//   // Allow resubmit if step was rejected, else check registration_step
//   if (!isRejected && astro.registration_step !== step) {
//     return {
//       success: false,
//       message: `You are on step ${astro.registration_step}`
//     };
//   }

//   // ======================
//   // UPDATE DATA
//   // ======================
//   let updateData = {
//     ...payload,
//     [stepStatusKey]: "pending",
//     approval_status: "resume"
//   };

//   if (step === 5) {
//     // Final submit
//     updateData.registration_completed = 1;
//     updateData.registration_step = 5;
//     updateData.approval_status = "pending";
//   } else if (isRejected) {
//     // Resubmit: check if any other step is also rejected
//     const otherRejectedStep = [1,2,3,4,5].find(
//       (s) => s !== step && astro[`step${s}_status`] === "rejected"
//     );

//     if (otherRejectedStep) {
//       // Koi aur step bhi rejected hai → usp pe bhejo
//       updateData.registration_step = otherRejectedStep;
//     } else {
//       // Koi aur rejected nahi → normal next step pe bhejo
//       updateData.registration_step = step + 1;
//     }
//   } else {
//     // Normal flow
//     updateData.registration_step = step + 1;
//   }

//   await repo.update(id, updateData);

//   // Check karo koi bhi step rejected toh nahi hai ab
//   const updatedAstro = await repo.findById(id);
//   const anyStillRejected = [1,2,3,4,5].some(
//     (s) => updatedAstro[`step${s}_status`] === "rejected"
//   );
//   const allPending = [1,2,3,4,5].every(
//     (s) => updatedAstro[`step${s}_status`] === "pending"
//   );

//   return {
//     success: true,
//     nextStep: updateData.registration_step,
//     completed: (step === 5 && !anyStillRejected) || (allPending && !anyStillRejected),
//     anyStillRejected,
//     allPending,
//     status: updateData.approval_status
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

      approval_status: "resume",
      step1_status: "pending"
    });

    return {
      success: true,
      id: newId,
      nextStep: 2,
      completed: false,
      step1_status: "pending",
      status: "resume"
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

  // Allow resubmit only if rejected
  if (!isRejected && astro.registration_step !== step) {
    return {
      success: false,
      message: `You are on step ${astro.registration_step}`
    };
  }

  // ======================
  // UPDATE STEP DATA
  // ======================
  let updateData = {
    ...payload,
    [stepStatusKey]: "pending"
  };

  // STEP FLOW CONTROL
  if (step === 5) {
    updateData.registration_completed = 1;
    updateData.registration_step = 5;
    updateData.approval_status = "pending"; 
  } else if (isRejected) {

    const otherRejectedStep = [1,2,3,4,5].find(
      (s) => s !== step && astro[`step${s}_status`] === "rejected"
    );

    if (otherRejectedStep) {
      updateData.registration_step = otherRejectedStep;
    } else {
      updateData.registration_step = step + 1;
    }

  } else {
    updateData.registration_step = step + 1;
  }

  await repo.update(id, updateData);

  // ======================
  // STATUS CALCULATION (ONLY ONCE)
  // ======================
  const updatedAstro = await repo.findById(id);

  const anyRejected = [1,2,3,4,5].some(
    (s) => updatedAstro[`step${s}_status`] === "rejected"
  );

  const allPending = [1,2,3,4,5].every(
    (s) => updatedAstro[`step${s}_status`] === "pending"
  );

  let newStatus = "resume";

  if (anyRejected) {
    newStatus = "partial_reject";
  }

  if (!anyRejected && !allPending && updatedAstro.registration_completed === 1) {
    newStatus = "pending";
  }

  await repo.update(id, {
    approval_status: newStatus
  });

  // ======================
  // FINAL RESPONSE
  // ======================
  const finalAstro = await repo.findById(id);

  const anyStillRejected = [1,2,3,4,5].some(
    (s) => finalAstro[`step${s}_status`] === "rejected"
  );

  const allStepsPending = [1,2,3,4,5].every(
    (s) => finalAstro[`step${s}_status`] === "pending"
  );

  return {
    success: true,
    nextStep: updateData.registration_step,
    completed: (step === 5 && !anyStillRejected) || (allStepsPending && !anyStillRejected),
    anyStillRejected,
    allPending: allStepsPending,
    status: finalAstro.approval_status
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