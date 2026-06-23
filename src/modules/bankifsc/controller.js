const Service = require("./service");

exports.getBankIfsc = async (req, res) => {
  try {
    const { ifsc } = req.params;

    const data = await Service.getBankIfsc(ifsc);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid IFSC code"
    });
  }
};