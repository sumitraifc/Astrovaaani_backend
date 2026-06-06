const service = require('./service');

exports.get = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    if (!req.body || !Object.keys(req.body).length)
      return res.status(400).json({ success: false, message: 'No settings provided' });
    await service.upsert(req.body);
    res.json({ success: true, message: 'Settings saved' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
