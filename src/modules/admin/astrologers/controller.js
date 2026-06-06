const service = require('./service');

exports.getList = async (req, res) => {
  try {
    const { search = '', status = 'all', page = 1, limit = 10 } = req.query;
    const data = await service.getList({ search, status, page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Astrologer not found' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PATCH /astrologers/:id/step/:step  body: { status: 'approved'|'rejected', remark }
exports.updateStepStatus = async (req, res) => {
  try {
    const { id, step } = req.params;
    const { status, remark } = req.body;
    if (!['approved', 'rejected'].includes(status))
      return res.status(400).json({ success: false, message: 'status must be approved or rejected' });
    if (![1, 2, 3, 4, 5].includes(+step))
      return res.status(400).json({ success: false, message: 'step must be 1–5' });
    if (status === 'rejected' && !remark?.trim())
      return res.status(400).json({ success: false, message: 'remark is required for rejection' });

    const adminId = req.admin?.id || req.user?.id;
    const approvalStatus = await service.updateStepStatus(id, +step, status, remark, adminId);
    res.json({ success: true, message: `Step ${step} ${status}`, approvalStatus });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.block = async (req, res) => {
  try {
    await service.block(req.params.id);
    res.json({ success: true, message: 'Astrologer blocked' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.unblock = async (req, res) => {
  try {
    await service.unblock(req.params.id);
    res.json({ success: true, message: 'Astrologer unblocked' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Astrologer deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateCommission = async (req, res) => {
  try {
    const { commission } = req.body;
    if (commission === undefined || commission < 0 || commission > 100)
      return res.status(400).json({ success: false, message: 'commission must be 0–100' });
    await service.updateCommission(req.params.id, commission);
    res.json({ success: true, message: 'Commission updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
