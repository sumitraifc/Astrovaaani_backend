const service = require('./service');
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = path.join(__dirname, '../../../../uploads/gifts');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_, file, cb) => cb(null, `gift_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
exports.uploadMiddleware = upload.single('image');

const giftUrl = (filename) =>
  filename ? `${process.env.BASE_URL}/uploads/gifts/${filename}` : null;

// ── Referral Settings ──────────────────────────────────────
exports.get = async (req, res) => {
  try {
    const data = await service.get();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { referral_bonus } = req.body;
    if (!referral_bonus) return res.status(400).json({ success: false, message: 'referral_bonus required' });
    await service.update({ referral_bonus });
    res.json({ success: true, message: 'Referral settings updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── Gift Amounts ───────────────────────────────────────────
exports.getGifts = async (req, res) => {
  try {
    const data = await service.getGifts();
    const mapped = data.map((g) => ({ ...g, image: giftUrl(g.image) }));
    res.json({ success: true, data: mapped });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createGift = async (req, res) => {
  try {
    const { name, amount, sort_order, is_active } = req.body;
    if (!name || !amount) return res.status(400).json({ success: false, message: 'name & amount required' });
    if (!req.file) return res.status(400).json({ success: false, message: 'image required' });
    const id = await service.createGift({ name, amount, image: req.file.filename, sort_order, is_active });
    res.json({ success: true, message: 'Gift created', id });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateGift = async (req, res) => {
  try {
    const { name, amount, sort_order, is_active } = req.body;
    if (!name || !amount) return res.status(400).json({ success: false, message: 'name & amount required' });
    const image = req.file ? req.file.filename : undefined;
    await service.updateGift(req.params.id, { name, amount, image, sort_order, is_active });
    res.json({ success: true, message: 'Gift updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteGift = async (req, res) => {
  try {
    await service.deleteGift(req.params.id);
    res.json({ success: true, message: 'Gift deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
