const service = require('./service');

exports.submitReport = async (req, res) => {
  try {
    const result = await service.submitReport(req.user, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const result = await service.getMyReports(req.user, req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
