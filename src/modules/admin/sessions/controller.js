const service = require('./service');

exports.getSessions = async (req, res) => {
  try {
    const { type = 'chat', search = '', status = 'all', page = 1, limit = 10 } = req.query;
    if (!['chat', 'audio', 'video'].includes(type))
      return res.status(400).json({ success: false, message: 'type must be chat | audio | video' });
    const data = await service.getSessions({ type, search, status, page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const { type = 'chat' } = req.query;
    if (!['chat', 'audio', 'video'].includes(type))
      return res.status(400).json({ success: false, message: 'type must be chat | audio | video' });
    const data = await service.getById(type, req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const data = await service.getStats();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
