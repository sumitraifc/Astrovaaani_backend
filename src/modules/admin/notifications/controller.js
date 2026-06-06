const service = require('./service');

exports.send = async (req, res) => {
  try {
    const { title, message, image, target, recipient_ids } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, message: 'title and message required' });
    if (!['all', 'users', 'astrologers', 'specific'].includes(target))
      return res.status(400).json({ success: false, message: 'target must be all | users | astrologers | specific' });
    if (target === 'specific' && (!recipient_ids?.length))
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
