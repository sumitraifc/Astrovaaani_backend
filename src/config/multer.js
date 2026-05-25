// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;











// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;










const multer = require("multer");
 const path = require("path");
 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "uploads"); // local simple
<<<<<<< HEAD
    // cb(null, "/www/wwwroot/Astrowanibackend/uploads");
   

cb(null, path.join(process.cwd(), "uploads"));
    //change on path 
=======
    cb(null, "/www/wwwroot/Astrowanibackend/uploads");
>>>>>>> 8b9b03af3fdeef17fa395b74ab7349798551d595
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

module.exports = multer({ storage });