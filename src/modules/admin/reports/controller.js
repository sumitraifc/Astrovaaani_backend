const service = require('./service');

exports.getStats = async (req, res) => {
  try {
    const data = await service.getStats();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAll = async (req, res) => {
  try {
    const { search = '', status = 'all', reported_by = 'all', page = 1, limit = 10 } = req.query;
    const data = await service.getAll({ search, status, reported_by, page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.takeAction = async (req, res) => {
  try {
    const valid = ['pending', 'reviewed', 'action_taken', 'ignored'];
    if (!valid.includes(req.body.status))
      return res.status(400).json({ success: false, message: `status must be: ${valid.join(', ')}` });
    await service.takeAction(req.params.id, req.body);
    res.json({ success: true, message: 'Action taken successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
