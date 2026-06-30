const service = require("./service");

// STEP 1
exports.step1 = async (req, res) => {

  try {

    const files = req.files;

    // const profile_image =
    //   files?.profile_image?.[0]?.path || null;

    // const id_proof =
    //   files?.id_proof?.[0]?.path || null;
    const profile_image =
  files?.profile_image?.[0]?.filename ||
  files?.profile_image?.[0]?.path?.split("/").pop() ||
  null;

const id_proof =
  files?.id_proof?.[0]?.filename ||
  files?.id_proof?.[0]?.path?.split("/").pop() ||
  null;

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

    // const education_cert =
    //   files?.education_cert?.[0]?.path || null;
    const education_cert =
  files?.education_cert?.[0]?.filename ||
  files?.education_cert?.[0]?.path?.split("/").pop() ||
  null;

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
      // {
      //   ...req.body,

      //   id_proof:
      //     files?.id_proof?.[0]?.path || null,

      //   address_proof:
      //     files?.address_proof?.[0]?.path || null,

      //   education_cert:
      //     files?.education_cert?.[0]?.path || null,

      //   astro_cert:
      //     files?.astro_cert?.[0]?.path || null,
      // }
      {
  ...req.body,

  id_proof:
    files?.id_proof?.[0]?.filename || null,

  address_proof:
    files?.address_proof?.[0]?.filename || null,

  education_cert:
    files?.education_cert?.[0]?.filename || null,

  astro_cert:
    files?.astro_cert?.[0]?.filename || null,
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

exports.registrationStatus = async (req, res, next) => {

  try {

    const id = req.params.id;

    if (!id) {
      return next({
        status: 400,
        message: "Astrologer id is required"
      });
    }

    const astro = await service.getStatus(id);

    if (!astro) {
      return next({
        status: 404,
        message: "Astrologer not found"
      });
    }

    res.json({
      success: true,
      data: astro
    });

  } catch (err) {
    next(err);
  }
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

exports.getProfile = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.getProfile(astrologerId);

    // 🔥 profile image full URL me convert karo
    if (result?.profile_image) {
      result.profile_image = `${process.env.BASE_URL}/uploads/${result.profile_image}`;
    }

    res.json({
      success: true,
      data: result
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

exports.uploadDocument = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.uploadDocument(
      astrologerId,
      req.body
    );

    res.json({
      success: true,
      message: "Document saved successfully",
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getTimeline = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.getTimeline(astrologerId);

    const formatFile = (file) =>
      file ? `${process.env.BASE_URL}/uploads/${file}` : null;

    if (result?.documents) {
      result.documents.id_proof = formatFile(result.documents.id_proof);
      result.documents.address_proof = formatFile(result.documents.address_proof);
      result.documents.education_certificate = formatFile(result.documents.education_certificate);

      // 🔥 added astro certificate
      result.documents.astro_certificate = formatFile(result.documents.astro_certificate);
    }

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const astrologerId = req.user.id;
    const files = req.files;

    const fileImage = files?.profile_image?.[0]?.filename;

    const payload = {
      name: req.body.name,
    };

    if (fileImage && fileImage.trim() !== "") {
      payload.profile_image = fileImage;
    }

    const result = await service.updateProfile(astrologerId, payload);

    // full URL
    if (result?.profile_image) {
      result.profile_image =
        `${process.env.BASE_URL}/uploads/${result.profile_image}`;
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// exports.updateProfile = async (req, res) => {
//   try {
//     const astrologerId = req.user.id;
//     const files = req.files;

//     const profile_image =
//       files?.profile_image?.[0]?.filename || null;

//     const result = await service.updateProfile(astrologerId, {
//       name: req.body.name,
//       profile_image
//     });

//     // full URL
//     if (result?.profile_image) {
//       result.profile_image =
//         `${process.env.BASE_URL}/uploads/${result.profile_image}`;
//     }

//     res.json({
//       success: true,
//       message: "Profile updated successfully",
//       data: result
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };