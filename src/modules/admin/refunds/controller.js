const service = require('./service');

exports.getAll = async (req, res) => {
  try {
    const { search = '', status = 'all', page = 1, limit = 10 } = req.query;
    const data = await service.getAll({ search, status, page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.approve = async (req, res) => {
  try {
    const adminId = req.admin?.id || req.user?.id;
    await service.approve(req.params.id, adminId);
    res.json({ success: true, message: 'Refund approved and wallet credited' });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.reject = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note?.trim()) return res.status(400).json({ success: false, message: 'Rejection note is required' });
    const adminId = req.admin?.id || req.user?.id;
    await service.reject(req.params.id, note, adminId);
    res.json({ success: true, message: 'Refund rejected' });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};
