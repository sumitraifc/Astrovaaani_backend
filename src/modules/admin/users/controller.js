const service = require('./service');

exports.getAll = async (req, res) => {
  try {
    const { search = '', status = 'all', page = 1, limit = 10 } = req.query;
    const data = await service.getAll({ search, status, page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.block = async (req, res) => {
  try {
    await service.block(req.params.id);
    res.json({ success: true, message: 'User blocked' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.unblock = async (req, res) => {
  try {
    await service.unblock(req.params.id);
    res.json({ success: true, message: 'User unblocked' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    await service.delete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addWallet = async (req, res) => {
  try {
    const { amount, note } = req.body;
    if (!amount) return res.status(400).json({ success: false, message: 'Amount required' });
    await service.addWallet(req.params.id, amount, note);
    res.json({ success: true, message: 'Wallet updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
