const service = require('./service');

exports.getProfile = async (req, res) => {
  try {
    const data = await service.getProfile(req.admin.id);
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateBankDetails = async (req, res) => {
  try {
    await service.updateBankDetails(req.admin.id, req.body);
    res.json({ success: true, message: 'Bank details updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPayoutHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await service.getPayoutHistory(req.admin.id, { page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.requestPayout = async (req, res) => {
  try {
    const { amount, method, note } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Valid amount required' });
    if (!method) return res.status(400).json({ success: false, message: 'Method required' });
    await service.requestPayout(req.admin.id, { amount, method, note });
    res.json({ success: true, message: 'Payout request submitted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
