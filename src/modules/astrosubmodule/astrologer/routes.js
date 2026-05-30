const express = require("express");
const router = express.Router();

const controller = require("./controller");

const upload = require("../../../config/multer");

// STEP 1
router.post(
  "/register-step-1",

  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "id_proof", maxCount: 1 }
  ]),

  controller.step1
);

// STEP 2
router.post(
  "/register-step-2",

  upload.fields([
    { name: "education_cert", maxCount: 1 }
  ]),

  controller.step2
);

// STEP 3
router.post(
  "/register-step-3",

  upload.fields([
    { name: "id_proof", maxCount: 1 },
    { name: "address_proof", maxCount: 1 },
    { name: "education_cert", maxCount: 1 },
    { name: "astro_cert", maxCount: 1 }
  ]),

  controller.step3
);

// STEP 4
router.post("/register-step-4",   upload.none(),
 controller.step4);

// STEP 5
router.post("/register-step-5",  upload.none(), controller.step5);

router.get("/resume/:id", controller.resume);

module.exports = router;