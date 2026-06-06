const service = require('./service');

exports.getStats = async (req, res) => {
  try {
    const data = await service.getStats();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRevenueChart = async (req, res) => {
  try {
    const data = await service.getRevenueChart();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRecentSessions = async (req, res) => {
  try {
    const data = await service.getRecentSessions();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
