const service = require("./service");

exports.createOrder = async (req, res) => {
  try {
    const result = await service.createOrder(req.user.id, req.body);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const result = await service.getOrders(req.user.id, req.query.page, req.query.limit);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const result = await service.getOrderById(
      req.user.id,
      req.params.id
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};