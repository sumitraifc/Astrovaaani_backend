const service = require("./service");

exports.getEarningHistory = async (req, res) => {
  try {
    const result = await service.getEarningHistory(req.user.id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

exports.getWalletInfo = async (req, res) => {
  try {
    const result = await service.getWalletInfo(req.user.id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

exports.requestWithdraw = async (req, res) => {
  try {
    const result = await service.requestWithdraw(req.user.id, req.body);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

exports.getWithdrawHistory = async (req, res) => {
  try {
    const result = await service.getWithdrawHistory(req.user.id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};