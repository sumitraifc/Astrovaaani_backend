const service = require('./service');
const multer  = require('../../../config/multer');

exports.upload = multer.single('image');

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) body.image = `/${req.file.filename}`;
    if (!body.name?.trim()) return res.status(400).json({ success: false, message: 'Name is required' });
    const id = await service.create(body);
    res.json({ success: true, message: 'Expertise created', id });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) body.image = `/${req.file.filename}`;
    await service.update(req.params.id, body);
    res.json({ success: true, message: 'Expertise updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Expertise deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
