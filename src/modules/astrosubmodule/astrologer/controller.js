const service = require("./service");

// STEP 1
exports.step1 = async (req, res) => {

  try {

    const files = req.files;

    const profile_image =
      files?.profile_image?.[0]?.path || null;

    const id_proof =
      files?.id_proof?.[0]?.path || null;

    const result = await service.saveStep(1, null, {

      ...req.body,

      profile_image,
      id_proof

    });

    res.json(result);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// STEP 2
exports.step2 = async (req, res) => {
  try {

    const files = req.files;

    const education_cert =
      files?.education_cert?.[0]?.path || null;

    const result = await service.saveStep(
      2,
      req.body.id,
      {
        ...req.body,
        education_cert
      }
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// STEP 3
exports.step3 = async (req, res) => {
  try {

    const files = req.files;

    const result = await service.saveStep(
      3,
      req.body.id,
      {
        ...req.body,

        id_proof:
          files?.id_proof?.[0]?.path || null,

        address_proof:
          files?.address_proof?.[0]?.path || null,

        education_cert:
          files?.education_cert?.[0]?.path || null,

        astro_cert:
          files?.astro_cert?.[0]?.path || null,
      }
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// STEP 4
exports.step4 = async (req, res) => {
  try {

    console.log("STEP4 BODY", req.body);
    console.log("STEP4 ID", req.body.id);

    const result = await service.saveStep(
      4,
      req.body.id,
      req.body
    );

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// STEP 5
exports.step5 = async (req, res) => {
  try {
  console.log("STEP5 BODY", req.body);
    console.log("STEP4 ID", req.body.id);
    const result = await service.saveStep(
      5,
      req.body.id,
      req.body
    );

    res.json({
      ...result,
      message:
        "Registration submitted. Under review 24-48 hours"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.registrationStatus = async (req, res) => {

  const astro = await service.getStatus(req.params.id);

  res.json({
    success: true,
    data: astro
  });

};

exports.resume = async (req, res) => {

  const astro =
    await service.getStatus(req.params.id);

  res.json({
    success: true,
    registration_step:
      astro.registration_step,

    registration_completed:
      astro.registration_completed,

    approval_status:
      astro.approval_status,

    data: astro
  });

};