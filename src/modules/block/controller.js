const service = require('./service');

exports.block = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    const result = await service.block(req.user, targetId, targetType);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.unblock = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    const result = await service.unblock(req.user, targetId, targetType);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getBlockList = async (req, res) => {
  try {
    const result = await service.getBlockList(req.user, req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkBlock = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    const result = await service.checkBlock(req.user, targetId, targetType);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
