const service = require('./service');

exports.getUserTransactions = async (req, res) => {
  try {
    const { search = '', type = 'all', status = 'all', page = 1, limit = 10 } = req.query;
    const data = await service.getUserTransactions({ search, type, status, page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAstrologerTransactions = async (req, res) => {
  try {
    const { search = '', type = 'all', status = 'all', page = 1, limit = 10 } = req.query;
    const data = await service.getAstrologerTransactions({ search, type, status, page: +page, limit: +limit });
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addUserAmount = async (req, res) => {
  try {
    const { user_id, amount, note } = req.body;
    if (!user_id || !amount) return res.status(400).json({ success: false, message: 'user_id and amount required' });
    await service.addUserAmount(user_id, amount, note);
    res.json({ success: true, message: 'Amount added to user wallet' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addAstrologerAmount = async (req, res) => {
  try {
    const { astrologer_id, amount, note } = req.body;
    if (!astrologer_id || !amount) return res.status(400).json({ success: false, message: 'astrologer_id and amount required' });
    await service.addAstrologerAmount(astrologer_id, amount, note);
    res.json({ success: true, message: 'Amount added to astrologer wallet' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
