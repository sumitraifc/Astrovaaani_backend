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
    await service.approve(req.params.id);
    res.json({ success: true, message: 'Review published' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.reject = async (req, res) => {
  try {
    await service.reject(req.params.id);
    res.json({ success: true, message: 'Review rejected' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
