const service = require('./service');

exports.getList = async (req, res) => {
  try {
    const { search = '', status = 'all', page = 1, limit = 10 } = req.query;
    const data = await service.getList({ search, status, page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.approve = async (req, res) => {
  try {
    const adminId = req.admin?.id || req.user?.id;
    const { utr_number } = req.body;
    await service.approve(req.params.id, adminId, utr_number);
    res.json({ success: true, message: 'Withdrawal approved' });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.reject = async (req, res) => {
  try {
    const adminId = req.admin?.id || req.user?.id;
    const { note } = req.body;
    if (!note?.trim()) return res.status(400).json({ success: false, message: 'Rejection note required' });
    await service.reject(req.params.id, adminId, note);
    res.json({ success: true, message: 'Withdrawal rejected' });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};
