const multer = require("multer");
const path = require("path");
const fs = require("fs");

// upload folder path
const uploadPath = "/www/wwwroot/Astrowanibackend/uploads";
// const uploadPath = "/var/www/vhosts/astrovaaani.com/root.astrovaaani.com/uploads";

// create folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage
});

module.exports = upload;