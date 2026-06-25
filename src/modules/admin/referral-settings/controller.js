const service = require('./service');
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = path.join(__dirname, '../../../../uploads/referral');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_, file, cb) => cb(null, `referral_gift_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

exports.uploadMiddleware = upload.single('gift_image');

exports.get = async (req, res) => {
  try {
    const data = await service.get();
    if (data?.gift_image) data.gift_image = `${process.env.BASE_URL}/uploads/referral/${data.gift_image}`;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.gift_image = req.file.filename;
    await service.update(payload);
    res.json({ success: true, message: 'Referral settings updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
