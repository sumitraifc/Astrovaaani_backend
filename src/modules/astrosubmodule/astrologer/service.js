
const repo = require("./repository");

exports.saveStep = async (step, id, payload) => {

  let astro = null;

  // STEP 1 CREATE
  if (step === 1) {

    const newId = await repo.create({

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
    });

    return {
      success: true,
      id: newId,
      nextStep: 2
    };
  }

  astro = await repo.findById(id);

  if (!astro) {
    throw new Error("Astrologer not found");
  }

  if (astro.registration_step !== step) {
    return {
      success: false,
      message: `You are on step ${astro.registration_step}`
    };
  }

  let updateData = {
    ...payload,
    registration_step: step + 1
  };

  // FINAL SUBMIT
  if (step === 5) {

    updateData.registration_completed = 1;

    updateData.registration_step = 5;

    updateData.approval_status = "pending";
  }

  await repo.update(id, updateData);

  return {
    success: true,
    nextStep: updateData.registration_step,
    completed: step === 5
  };
};

exports.getStatus = async (id) => {
  return await repo.findById(id);
};