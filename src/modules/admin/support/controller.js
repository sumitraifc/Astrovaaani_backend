const service = require('./service');
const multer  = require('../../../config/multer');

exports.upload = multer.single('attachment');

exports.getAll = async (req, res) => {
  try {
    const { search = '', status = 'all', raised_by = 'all', page = 1, limit = 10 } = req.query;
    const data = await service.getAll({ search, status, raisedBy: raised_by, page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const data = await service.getStats();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, admin_comment } = req.body;
    const valid = ['open', 'in_review', 'resolved', 'rejected'];
    if (!valid.includes(status))
      return res.status(400).json({ success: false, message: `status must be: ${valid.join(', ')}` });
    await service.updateStatus(req.params.id, status, admin_comment);
    res.json({ success: true, message: `Ticket marked as ${status}` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim() && !req.file)
      return res.status(400).json({ success: false, message: 'Message or attachment required' });

    const adminName = 'Admin';
    const msgId = await service.addMessage(req.params.id, 'admin', adminName, message || '');

    if (req.file) {
      const fileUrl  = `/uploads/${req.file.filename}`;
      const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'file';
      await service.addAttachment(msgId, req.params.id, fileUrl, req.file.originalname, fileType);
    }

    res.json({ success: true, message: 'Message sent' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
