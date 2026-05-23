const service = require("./service");

exports.getPrivacyPolicy = async (req, res) => {
  try {
    const data = await service.getPrivacyPolicy();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getTerms = async (req, res) => {
  try {
    const data = await service.getTerms();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getContactUs = async (req, res) => {
  try {
    const data = await service.getContactUs();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getFaqs = async (req, res) => {
  try {
    const data = await service.getFaqs();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const data = await service.getBanners();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};