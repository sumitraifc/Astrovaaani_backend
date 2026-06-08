// routes/upload.js - pura file aisa hona chahiye
const express = require("express");
const router = express.Router();  // ← yeh add karo
const upload = require("../../config/multer");

router.post("/chat/upload-file", upload.single("chat_file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  res.json({
    success: true,
    file_url: req.file.filename,
    full_url: `${process.env.BASE_URL}/uploads/${req.file.filename}`
  });
});

module.exports = router;  // ← yeh bhi add karo