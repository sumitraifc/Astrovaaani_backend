const service = require('./service');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    res.json({ success: true, url });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.send = async (req, res) => {
  try {
    const { title, message, image, target, recipient_ids } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, message: 'title and message required' });

    const validTargets = ['all', 'users', 'astrologers', 'specific_user', 'specific_astrologer'];
    if (!validTargets.includes(target))
      return res.status(400).json({ success: false, message: 'Invalid target' });
    if ((target === 'specific_user' || target === 'specific_astrologer') && !recipient_ids?.length)
      return res.status(400).json({ success: false, message: 'recipient_ids required for specific target' });

    const sent_by = req.admin?.id || req.user?.id;
    const sentCount = await service.send({ title, message, image, target, recipient_ids, sent_by });
    res.json({ success: true, message: `Notification sent to ${sentCount} device(s)`, sentCount });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const data = await service.getHistory({ page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
