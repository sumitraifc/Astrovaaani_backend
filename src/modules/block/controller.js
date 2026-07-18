const service = require('./service');
const { getAllAstrologers } = require('../../sockets/astrologerHandler');

exports.block = async (req, res) => {
  try {
    const { targetId, targetType, role } = req.body;
    const user = { ...req.user, role: role || 'user' };
    const result = await service.block(user, targetId, targetType);

    // Socket: sirf is user ki list update karo
    if (role !== 'astrologer') {
      const io = req.app.get('io');
      const updatedList = await getAllAstrologers(user.id);
      io.to(`user_${user.id}`).emit('astrologer:list_updated', { success: true, data: updatedList });
    }

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.unblock = async (req, res) => {
  try {
    const { targetId, targetType, role } = req.body;
    const user = { ...req.user, role: role || 'user' };
    const result = await service.unblock(user, targetId, targetType);

    // Socket: sirf is user ki list update karo
    if (role !== 'astrologer') {
      const io = req.app.get('io');
      const updatedList = await getAllAstrologers(user.id);
      io.to(`user_${user.id}`).emit('astrologer:list_updated', { success: true, data: updatedList });
    }

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getBlockList = async (req, res) => {
  try {
    const user = { ...req.user, role: req.query.role || 'user' };
    const result = await service.getBlockList(user, req.query);
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
