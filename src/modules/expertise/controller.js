const service = require("./service");

exports.getAll = async (req, res) => {
  try {

    const result = await service.getAll();

    res.json(result);

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};