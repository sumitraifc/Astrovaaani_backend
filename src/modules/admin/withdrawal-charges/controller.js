const service = require('./service');

exports.get = async (req, res) => {
  try {
    const data = await service.get();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    await service.update(req.body);
    res.json({ success: true, message: 'Withdrawal charges updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
