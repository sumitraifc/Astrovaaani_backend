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
    const result = await service.getTransactions(req.user.id, req.query.type, req.query.page, req.query.limit);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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
    console.log('[cashfreeCallback] received', {
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      bodyPresent: req.body && Object.keys(req.body).length,
      queryPresent: req.query && Object.keys(req.query).length
    });

    const payload = (req.body && Object.keys(req.body).length) ? req.body : req.query;
    console.log('[cashfreeCallback] using payload', payload);

    const result = await service.handleCashfreeCallback(payload);

    console.log('[cashfreeCallback] result', result);

    // Always return 200 OK for webhook (transaction was processed or already completed)
    res.status(200).json(result);
  } catch (err) {
    console.error('[cashfreeCallback] error', err && err.stack ? err.stack : err);
    
    // Return 202 Accepted for transient errors (Cashfree will retry)
    // Return 400 for invalid payloads
    const statusCode = err.message?.includes('missing order_id') ? 400 : 202;
    
    res.status(statusCode).json({
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