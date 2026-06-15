const service = require("./service");

exports.getWallet = async (req, res) => {
  try {
    const result = await service.getWallet(req.user.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const result = await service.getTransactions(req.user.id, req.query.type );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.addMoney = async (req, res) => {
  try {
    const result = await service.addMoney(
      req.user.id,
      req.body.amount
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const result = await service.createPaymentOrder(
      req.user.id,
      req.body.amount
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.cashfreeCallback = async (req, res) => {
  try {
    const result = await service.handleCashfreeCallback(req.body);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.spendMoney = async (req, res) => {
  try {
    const result = await service.spendMoney(
      req.user.id,
      req.body.amount
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.refundMoney = async (req, res) => {
  try {
    const result = await service.refundMoney(
      req.user.id,
      req.body.amount
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};